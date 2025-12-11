import firebase_admin
from firebase_admin import credentials, firestore
import time
import uuid
import matplotlib.pyplot as plt

# --- CẤU HÌNH ---
TARGET_NAME = "Homestay Đặc Biệt Hà Giang" # Tên homestay cần tìm
TARGET_PROVINCE = "Tỉnh Hà Giang"
TARGET_SHARD = "properties_hagiang"
BIG_TABLE = "properties_unsharded"

try:
    app = firebase_admin.get_app()
except ValueError:
    cred = credentials.Certificate('service-account-key.json')
    firebase_admin.initialize_app(cred)
db = firestore.client()

def prepare_specific_data():
    print(f"🛠️ Đang tạo homestay mục tiêu: '{TARGET_NAME}'...")
    
    # Tạo dữ liệu cho homestay này
    prop_id = "special_homestay_id_123" # ID cố định để dễ quản lý
    data = {
        "id": prop_id,
        "name": TARGET_NAME,
        "price": 999999,
        "address": {
            "city_name": TARGET_PROVINCE,
            "district": "Huyện Đồng Văn",
            "detailed_address": "Cột Cờ Lũng Cú"
        },
        "created_at": firestore.SERVER_TIMESTAMP
    }
    
    batch = db.batch()
    # 1. Nhét vào Bảng To (nơi đã có hàng nghìn cái khác)
    batch.set(db.collection(BIG_TABLE).document(prop_id), data)
    
    # 2. Nhét vào Bảng Nhỏ (nơi chỉ có vài cái)
    batch.set(db.collection(TARGET_SHARD).document(prop_id), data)
    
    batch.commit()
    print("✅ Đã tạo xong dữ liệu mẫu!")

def benchmark_single_search():
    print(f"\n🏁 BẮT ĐẦU TÌM KIẾM HOMESTAY CỤ THỂ: '{TARGET_NAME}'...")
    
    # Warm up
    try: db.collection(BIG_TABLE).limit(1).get()
    except: pass

    # --- TEST 1: UNSHARDED (Tìm trong bảng to) ---
    print(f"1️⃣  Unsharded: Tìm trong '{BIG_TABLE}'...")
    start_un = time.time()
    
    # Query: Tìm theo Tên (Name)
    # Lưu ý: Cần Index cho field 'name' nếu dữ liệu lớn
    try:
        query = db.collection(BIG_TABLE).where('name', '==', TARGET_NAME).limit(1)
        docs_un = query.get()
        time_un = (time.time() - start_un) * 1000
        found = len(docs_un) > 0
        print(f"   -> Tìm thấy: {found} | Thời gian: {time_un:.2f} ms")
    except Exception as e:
        print(f"   ❌ Lỗi Unsharded (Thiếu Index?): {e}")
        time_un = 0

    # --- TEST 2: SHARDED (Tìm trong bảng nhỏ) ---
    print(f"\n2️⃣  Sharded: Tìm trong '{TARGET_SHARD}'...")
    start_sh = time.time()
    
    # Query: Cũng tìm theo Tên, nhưng trong bảng nhỏ
    query_sh = db.collection(TARGET_SHARD).where('name', '==', TARGET_NAME).limit(1)
    docs_sh = query_sh.get()
    
    time_sh = (time.time() - start_sh) * 1000
    found_sh = len(docs_sh) > 0
    print(f"   -> Tìm thấy: {found_sh} | Thời gian: {time_sh:.2f} ms")

    return time_un, time_sh

def draw_chart(t1, t2):
    if t1 == 0 and t2 == 0: return

    plt.figure(figsize=(8, 6))
    labels = ['Unsharded\n(Tìm trong Bảng Lớn)', 'Sharded\n(Tìm trong Bảng Nhỏ)']
    times = [t1, t2]
    colors = ['#ff7675', '#00cec9'] 

    bars = plt.bar(labels, times, color=colors, width=0.5)
    
    plt.ylabel('Thời gian tìm kiếm (ms)')
    plt.title(f'Tốc độ tìm 1 Homestay cụ thể\n(Query theo Tên)')
    plt.grid(axis='y', linestyle='--', alpha=0.5)
    
    # Thêm số liệu
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height,
                 f'{height:.1f} ms', ha='center', va='bottom', fontweight='bold', fontsize=12)

    plt.savefig('result_single_search.png')
    print("\n📊 Đã lưu biểu đồ: result_single_search.png")
    plt.show()

if __name__ == "__main__":
    prepare_specific_data()
    time.sleep(1) 
    t1, t2 = benchmark_single_search()
    draw_chart(t1, t2)