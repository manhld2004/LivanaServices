import firebase_admin
from firebase_admin import credentials, firestore
import time
import threading
import matplotlib.pyplot as plt
import random

# --- CẤU HÌNH MẠNH HƠN ---
# Tăng số lượng update lên để biểu đồ chi tiết hơn
# Unsharded sẽ rất khổ sở ở các mốc cao (100, 200)
UPDATE_COUNTS = [20, 50, 100, 200, 500] 

# Số người dùng cùng lúc (Càng đông càng tắc)
CONCURRENT_USERS = 30 

try:
    app = firebase_admin.get_app()
except ValueError:
    cred = credentials.Certificate('service-account-key.json')
    firebase_admin.initialize_app(cred)
db = firestore.client()

# Reset dữ liệu trước khi test
print("🧹 Đang reset lại Counter...")
db.collection('stats').document('unsharded_counter').set({'count': 0})
# Tạo 20 shard để hứng chịu tải
for i in range(20):
    db.collection('stats').document(f'sharded_counter_{i}').set({'count': 0})

def update_unsharded(n):
    """Unsharded: Chen chúc nhau update 1 file"""
    ref = db.collection('stats').document('unsharded_counter')
    for _ in range(n):
        # Transaction + Retry liên tục do bị lock
        @firestore.transactional
        def txn(transaction, doc_ref):
            snapshot = transaction.get(doc_ref)
            transaction.update(doc_ref, {'count': snapshot.get('count') + 1})
        
        transaction = db.transaction()
        try:
            txn(transaction, ref)
        except Exception:
            # Nếu bị lỗi (do quá tải), nghỉ 0.2s rồi thử lại
            time.sleep(0.2) 

def update_sharded(n):
    """Sharded: Tản ra 20 file khác nhau"""
    for _ in range(n):
        # Chọn ngẫu nhiên 1 trong 20 shard
        shard_id = random.randint(0, 19)
        ref = db.collection('stats').document(f'sharded_counter_{shard_id}')
        
        @firestore.transactional
        def txn(transaction, doc_ref):
            snapshot = transaction.get(doc_ref)
            transaction.update(doc_ref, {'count': snapshot.get('count') + 1})
            
        transaction = db.transaction()
        try:
            txn(transaction, ref)
        except Exception:
            pass

def run_test():
    print(f"🚀 BẮT ĐẦU TEST UPDATE COUNTER (LARGE SCALE)...")
    results_un = []
    results_sh = []

    for total_updates in UPDATE_COUNTS:
        # Chia đều task cho các user
        load_per_user = max(1, total_updates // CONCURRENT_USERS)
        
        print(f"\n⚡ Mốc: {total_updates} Updates (30 người cùng tranh giành)...")

        # --- 1. Test UNSHARDED ---
        # Nếu mốc lớn quá (>100), Unsharded chạy rất lâu, ta đo xem nó chịu được bao lâu
        print("   -> Đang chạy Unsharded (Sẽ rất lâu)...")
        start = time.time()
        threads = []
        for _ in range(CONCURRENT_USERS):
            t = threading.Thread(target=update_unsharded, args=(load_per_user,))
            threads.append(t)
            t.start()
        for t in threads: t.join()
        
        dur_un = time.time() - start
        results_un.append(dur_un)
        print(f"      ⏱️ Unsharded mất: {dur_un:.2f}s")

        # --- 2. Test SHARDED ---
        print("   -> Đang chạy Sharded...")
        start = time.time()
        threads = []
        for _ in range(CONCURRENT_USERS):
            t = threading.Thread(target=update_sharded, args=(load_per_user,))
            threads.append(t)
            t.start()
        for t in threads: t.join()
        
        dur_sh = time.time() - start
        results_sh.append(dur_sh)
        print(f"      ⏱️ Sharded mất: {dur_sh:.2f}s")

    # Vẽ biểu đồ
    draw_chart(results_un, results_sh)

def draw_chart(un, sh):
    plt.figure(figsize=(12, 6))
    
    plt.plot(UPDATE_COUNTS, un, marker='o', label='Unsharded (1 Counter)', color='red', linewidth=2, linestyle='--')
    plt.plot(UPDATE_COUNTS, sh, marker='s', label='Sharded (20 Distributed Counters)', color='green', linewidth=2)
    
    plt.title('Stress Test: Update Counter (Hiệu quả của Sharding)', fontsize=14)
    plt.xlabel('Tổng số lượng Update cần xử lý', fontsize=12)
    plt.ylabel('Thời gian hoàn thành (Giây)', fontsize=12)
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.legend()
    
    plt.savefig('counter_benchmark_large.png')
    print("\n✅ Xong! Kiểm tra file 'counter_benchmark_large.png'")
    plt.show()

if __name__ == "__main__":
    run_test()