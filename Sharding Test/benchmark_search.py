import firebase_admin
from firebase_admin import credentials, firestore
import time
import matplotlib.pyplot as plt
import numpy as np

# --- CẤU HÌNH ---
# Các thành phố muốn test tìm kiếm
TEST_LOCATIONS = [
    {"name": "Thành phố Hà Nội", "slug": "hanoi"},
    {"name": "Thành phố Đà Nẵng", "slug": "danang"},
    {"name": "Thành phố Hồ Chí Minh", "slug": "hcm"}
]

# Số lần chạy lặp lại để lấy trung bình (giúp kết quả chính xác hơn)
ITERATIONS = 5

try:
    app = firebase_admin.get_app()
except ValueError:
    cred = credentials.Certificate('service-account-key.json')
    firebase_admin.initialize_app(cred)
db = firestore.client()

def measure_query_time(collection_ref, is_sharded, city_name=None):
    """Hàm đo thời gian thực hiện query"""
    total_time = 0
    total_docs = 0
    
    for _ in range(ITERATIONS):
        start = time.time()
        
        if is_sharded:
            # SHARDED: Lấy trực tiếp toàn bộ collection (quét 100% trong kho nhỏ)
            docs = collection_ref.get()
        else:
            # UNSHARDED: Phải lọc trong kho lớn (quét Index)
            # Lưu ý: Cần Index cho field 'address.city_name'
            docs = collection_ref.where('address.city_name', '==', city_name).get()
            
        duration = (time.time() - start) * 1000 # Đổi ra mili-giây (ms)
        total_time += duration
        total_docs = len(docs)
        
    avg_time = total_time / ITERATIONS
    return avg_time, total_docs

def run_benchmark():
    print(f"🚀 BẮT ĐẦU ĐO TỐC ĐỘ TÌM KIẾM (TRUNG BÌNH {ITERATIONS} LẦN CHẠY)...")
    
    cities_labels = [loc['slug'].upper() for loc in TEST_LOCATIONS]
    times_unsharded = []
    times_sharded = []
    
    # Warm up kết nối
    print("🔥 Warming up...")
    try:
        db.collection('properties_unsharded').limit(1).get()
    except: pass

    for loc in TEST_LOCATIONS:
        print(f"\n📍 Đang test: {loc['name']}...")
        
        # 1. Đo Unsharded
        coll_un = db.collection('properties_unsharded')
        t_un, count_un = measure_query_time(coll_un, is_sharded=False, city_name=loc['name'])
        times_unsharded.append(t_un)
        print(f"   [Unsharded] Tìm thấy {count_un} homestay -> {t_un:.2f} ms")

        # 2. Đo Sharded
        coll_sh = db.collection(f"properties_{loc['slug']}")
        t_sh, count_sh = measure_query_time(coll_sh, is_sharded=True)
        times_sharded.append(t_sh)
        print(f"   [Sharded]   Tìm thấy {count_sh} homestay -> {t_sh:.2f} ms")

    # --- VẼ BIỂU ĐỒ ---
    draw_chart(cities_labels, times_unsharded, times_sharded)

def draw_chart(labels, unsharded_data, sharded_data):
    x = np.arange(len(labels))  # Vị trí các nhãn
    width = 0.35  # Độ rộng cột

    fig, ax = plt.subplots(figsize=(10, 6))
    rects1 = ax.bar(x - width/2, unsharded_data, width, label='Unsharded (Filter)', color='#d9534f')
    rects2 = ax.bar(x + width/2, sharded_data, width, label='Sharded (Direct)', color='#5cb85c')

    # Trang trí biểu đồ
    ax.set_ylabel('Thời gian phản hồi (ms)')
    ax.set_title('So sánh tốc độ Tìm kiếm theo Thành phố')
    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.legend()
    ax.grid(axis='y', linestyle='--', alpha=0.7)

    # Hàm hiển thị số liệu trên đầu cột
    def autolabel(rects):
        for rect in rects:
            height = rect.get_height()
            ax.annotate(f'{height:.0f}',
                        xy=(rect.get_x() + rect.get_width() / 2, height),
                        xytext=(0, 3),  # 3 points vertical offset
                        textcoords="offset points",
                        ha='center', va='bottom')

    autolabel(rects1)
    autolabel(rects2)

    fig.tight_layout()
    plt.savefig('search_benchmark_result.png')
    print("\n📊 Đã vẽ xong biểu đồ! Mở file 'search_benchmark_result.png' để xem.")
    plt.show()

if __name__ == "__main__":
    run_benchmark()