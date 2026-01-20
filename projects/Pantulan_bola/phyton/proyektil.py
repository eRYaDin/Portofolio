import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, PillowWriter
# from IPython.display import HTML, display
import csv

# PENJELASAN PENGGUNA
penjelasan_pengguna = """
SIMULASI DINAMIKA ENERGI 2D

Tujuan:
Untuk memahami bagaimana perubahan massa bola (m) mempengaruhi energi (Energi Kinetik, Potensial, dan Mekanik) 
selama lemparan proyektil, dengan mengasumsikan tidak ada gesekan udara.

Parameter yang dicari:
1. Energi Kinetik.
2. Energi Potensial.
3. Energi Mekanik.

Prinsip Utama:
Selama kecepatan awal (v0) dan sudut lemparan konstan:
- Lintasan dan waktu terbang TIDAK dipengaruhi oleh massa.
- Semua nilai energi (Ek, Ep, Em) berbanding lurus dengan massa (m).
"""

# BANTUAN PENGGUNA
bantuan_pengguna = """
1. 🚀 MULAI SIMULASI & PLOT:
    - Memilih atau memasukkan nilai Massa, Kecepatan Awal (v0), dan Sudut Lemparan.
    - Menjalankan simulasi, dan menunggu hasil perhitungan dan grafik tersimpan.
    - Grafik Lintasan dan Dinamika Energi akan muncul.

2. 💡 PENJELASAN SIMULASI:
    - Berisi detail ilmiah dari parameter yang digunakan dalam perhitungan simulasi.

3. ❓ BANTUAN PENGGUNA:
    - Berisi panduan ini dan informasi kontak.

4. 🚪 KELUAR SIMULASI:
    - Merupakan opsi untuk keluar dan kembali ke pilihan awal.

Notes :
    - Simulasi ini merupakan simulasi ideal/ tanpa memiliki hambatan udara
    - Pada figure terdapat logo "tanda panah" dan "kaca pembesar" untuk melihat grafik lebih jelas
"""

# ===== !!! LOGIKA SIMULASI !!! ======... hahahha<3
# konstantaa yang digunakan
g = 9.81 # nilai percepatan gravitasi yang diketahui dan digunakan (m/s^2)
dt = 0.1 # langkah waktu untuk simulasi yang dilakukan (s)

# list bola [nama, massa (kg), diameter (m), warna]
list_bola = [
    ("Bola Pingpong", 0.0027, 0.12, "yellow"),
    ("Bola Tenis", 0.0046, 0.14, "green"),
    ("Bola Billiard", 0.156, 0.15, "black"),
    ("Bola Basket", 0.58, 0.20, "orange"),
    ("Bola Sepak", 0.41, 0.20, "purple"),
    ("Bola Voli", 0.26, 0.18, "blue"),
    ("Bola Rugby", 0.41, 0.19, "brown"),
]

# definisi fungsi
def simulasi_lemparan(massa, v0, sudut_derajat, g, dt):
    sudut_radian = np.radians(sudut_derajat) 
    v0x = v0 * np.cos(sudut_radian)
    v0y = v0 * np.sin(sudut_radian)
    
    t = [0]
    x = [0]
    y = [0] 
    vx = [v0x]
    vy = [v0y]
    
    fase_memantul = True

    langkah = 0
    max_langkah = 10000

    while fase_memantul or (abs(vx[-1]) > 0.005):
        
        langkah += 1
        if langkah > max_langkah:
            break
        
        vy_lamaa = vy[-1]
        vx_lamaa = vx[-1]
        t_baru = t[-1] + dt
        
        vx_coba = vx_lamaa
        vy_coba = vy_lamaa - g * dt
        x_coba = x[-1] + vx_coba * dt
        y_coba = y[-1] + vy_coba * dt

        x_baru = x_coba
        y_baru = y_coba
        vx_baru = vx_coba
        vy_baru = vy_coba

        if fase_memantul and y_coba < 0:
            ratio = y[-1] / (y[-1] - y_coba)
            t_impact = t[-1] + ratio * dt
            x_impact = x[-1] + ratio * vx_lamaa * dt
            vy_impact = vy_lamaa - g * ratio * dt 
            vx_impact = vx_lamaa

            t.append(t_impact)
            x.append(x_impact)
            y.append(0.0)
            vx.append(vx_impact)
            vy.append(vy_impact)
 
            vy_dampak = -(0.95) * vy_impact 
            vx_sekarang = vx_lamaa * 0.99 # hilang sedikit energi horizontalnya saat benturan

            if abs(vy_dampak) < 0.005:
                fase_memantul = False
 
            dt_after_impact = t_baru - t_impact

            if fase_memantul:
                vx_baru = vx_sekarang
                vy_baru = vy_dampak - g * dt_after_impact
                y_baru = 0.0 + vy_dampak * dt_after_impact - 0.5 * g * dt_after_impact**2
                x_baru = x_impact + vx_sekarang * dt_after_impact

            else:
                vx_baru = vx_sekarang * 0.95 # hilang lebih banyak energi kalau mulai gelinding
                vy_baru = 0.0
                y_baru = 0.0
                x_baru = x_impact + vx_baru * dt_after_impact

        elif not fase_memantul:
            mu_k = 0.0
            f_gesek = mu_k * massa * g
            a_x = -f_gesek / massa

            vx_baru = vx_lamaa + a_x * dt

            vy_baru = 0.0 
            y_baru = 0.0 
            x_baru = x[-1] + vx_baru * dt
        if vx_baru < 0.01: 
            vx_baru = 0.0
            break # bolanya berhenti
    
        t.append(t_baru)
        x.append(x_baru)
        y.append(y_baru)
        vx.append(vx_baru)
        vy.append(vy_baru)

    # hitungan energinyaa
    v_sq = np.array(vx)**2 + np.array(vy)**2
    ek = 0.5 * massa * v_sq
    ep = massa * g * np.array(y)
    em = ek + ep
    
    return np.array(t), np.array(x), np.array(y), ek, ep, em

# Menu
def menu():
    print("-" * 50)
    print("SIMULASI DINAMIKA ENERGI")
    print("Pilih opsi di bawah ini:")
    print(" 1. 🚀 MULAI SIMULASI & PLOT.")
    print(" 2. 💡 PENJELASAN SIMULASI.")
    print(" 3. ❓ BANTUAN PENGGUNA.")
    print(" 4. 🚪 KELUAR SIMULASI.")
    print("-" * 50)

# FUNGSI MEMILIH BOLA
def memilih_bola_fungsi():
    print("\n" + "="*50)
    print("PILIH BOLA")
    print("="*50)
    for i, bola in enumerate(list_bola, start=1):
        print(f"{i}. {bola[0]} (massa={bola[1]} kg, diameter={bola[2]} m)")
    print(f"{len(list_bola)+1}. Bola Custom")
    print("-" * 50)
    
    # untuk memilih satu atau lebih bola
    while True:
        try:
            pilihan_input = input("Masukkan nomor bola dengan angkaa: ")
            pilihan_list = [p.strip() for p in pilihan_input.replace(" ", "").split(",") if p.strip().isdigit()]
            
            if not pilihan_list:
                print("❌ Inputnya tidak valid. Masukkan nomor bola yang benar yaa.")
                continue
            
            bola_terpilih_final = []
            
            for p_str in pilihan_list:
                p = int(p_str)
                    
                # opsinya kalau bola itu default
                if 1 <= p <= len(list_bola):
                    bola_terpilih_final.append(list_bola[p-1])
                    
                # nah kalau ini bola customm
                elif p == len(list_bola) + 1:
                    while True:
                        try:
                            nama = input("Nama Bola Custom: ")
                            m = float(input("Massa bola custom (kg): "))
                            d = float(input("Diameter bola custom (m): "))
                            
                            if m <= 0 or d <= 0:
                                print("Massa dan diameter harus positif yaah.")
                                continue
                            
                            bola_terpilih_final.append((nama, m, d, "red"))
                            break
                                
                        except ValueError:
                            print("⚠️ harus berupa angka untuk nilai massa/diameter.")
                else:
                    print(f"❌ Nomor {p} nya tidak valid. Akan diabaikan~.")
                    
            if bola_terpilih_final:
                return bola_terpilih_final
            else:
                print("❌ Tidak ada bola yang dipilih. Cobaa lagi!")
                
        except Exception:
            print("⚠️ Input bermasalah. Coba lagii!")

# fungsi untuk simulasi dimulai
def simulasi_dimulai_fungsi():
    
    # 1. memilih bolaa
    bola_list = memilih_bola_fungsi()
    
    if not bola_list:
        print("❌ simulasinya dibatalkan karena tidak ada bola yang dipilih~.")
        return
    
    # 2. input dari parameter nyaa
    while True:
        try:
            print("\n" + "="*50)
            print("MASUKKAN PARAMETER LEMPARAN")
            print("="*50)
            v0 = float(input("Kecepatan awal (v0, m/s): "))
            sudut_derajat = float(input("Sudut lemparan (derajat): "))
            
            if v0 <= 0 or not (0 <= sudut_derajat <= 90):
                print("Kecepatan harus positif dan sudut antara 0-90 derajat.")
                continue
            
            break
        except ValueError:
            print("⚠️ Input harus berupa angka yak.")
    
    # 3. simulasi akan dijalankan dari setiap bolaa
    hasil_simulasi = []
    print("\n---!! PROSES SIMULASI<3 !!---")
    for nama, massa, diameter, warna in bola_list:
        print(f"Mensimulasikan {nama} (m={massa} kg) (diameter={diameter} m)...")

        # fungsi simulasi_lemparan akan dipanggil
        t, x, y, ek, ep, em = simulasi_lemparan(massa, v0, sudut_derajat, g, dt)
        hasil_simulasi.append({
            'nama': nama,
            'data': (t, x, y, ek, ep, em),
            'warna': warna
        })
        
    print("--- SIMULASI SELESAI!! ---\n")
    return hasil_simulasi

# fungsi untuk animasi dan plotting
def buat_animasi_gabungan(hasil_simulasi):
    if not hasil_simulasi:
        print("Tidak ada hasil...")
        return
    
    plt.ion() # cobaa mode interaktif nya ON

    # nah kalau ini inisialisasi figure untuk dua subplot
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6)) 
    fig.suptitle("Simulasi Dinamika Energi", fontsize=16)
    
    # untuk menentukan batas sumbu dari semua bolaa
    max_x_path = max(max(data['data'][1]) for data in hasil_simulasi) * 1.1
    max_y_path = max(max(data['data'][2]) for data in hasil_simulasi) * 1.1
    max_t_energy = max(max(data['data'][0]) for data in hasil_simulasi) * 1.1
    max_e_energy = max(max(data['data'][5]) for data in hasil_simulasi) * 1.1
    
    # untuk lintasan bolanya
    ax1.set_xlim(-0.1, max_x_path)
    ax1.set_ylim(-0.1, max_y_path)
    ax1.set_xlabel("Jarak Horizontal (m)")
    ax1.set_ylabel("Ketinggian (m)")
    ax1.axhline(0, color='brown', linestyle='-', linewidth=3, zorder=0)
    ax1.set_aspect('auto')
    ax1.set_title("Lintasan<3.")
    
    path_lines = [] 
    ball_points = [] 
    
    # untuk dinamika energinya
    ax2.set_xlim(0, max_t_energy)
    ax2.set_ylim(0, max_e_energy)
    ax2.set_xlabel("Waktu (s)")
    ax2.set_ylabel("Energi (Joule)")
    ax2.set_title("Dinamika Energi (EK, EP, EM)")
    ax2.grid(True, linestyle=':')
    
    ek_lines = []
    ep_lines = []
    em_lines = []

    # nilai teks waktunya (ax2)
    time_text_energy = ax2.text(0.02, 0.95, '', transform=ax2.transAxes)
    
    # garis untuk semua bola
    for data in hasil_simulasi:
        nama = data['nama']
        warna = data['warna']
        t, x, y, ek, ep, em = data['data']
        
        ball_point, = ax1.plot([x[0]], [y[0]], 'o', color=warna, markersize=8, zorder=5)
        ball_points.append(ball_point)

        path_line, = ax1.plot(x, y, '--', lw=1, color=warna, alpha=0.7, label=f'Lintasan {nama}') 
        path_lines.append(path_line)
        
        # LaTex...
        ek_line, = ax2.plot([], [], '-', lw=1.5, color=warna, label=f'$E_k$ ({nama})')
        ep_line, = ax2.plot([], [], ':', lw=1.5, color=warna, alpha=0.8, label=f'$E_p$ ({nama})')
        em_line, = ax2.plot([], [], '--', lw=1.5, color=warna, alpha=0.9, label=f'$E_m$ ({nama})')
        
        ek_lines.append(ek_line)
        ep_lines.append(ep_line)
        em_lines.append(em_line)
        
    ax1.legend(loc='upper right', fontsize='small')
    ax2.legend(loc='upper left', fontsize='small')

    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    # plt.show()
    
    # untuk fungsi updatenya
    def update(frame):
        artists = [] 
        for idx, data_dict in enumerate(hasil_simulasi):
            t, x, y, ek, ep, em = data_dict['data']
            
            if frame < len(t):
                # update dari lintasann
                ball_points[idx].set_data([x[frame]], [y[frame]]) 
                artists.extend([path_lines[idx], ball_points[idx]])
                
                # update dari dinamika energinya
                ek_lines[idx].set_data(t[:frame+1], ek[:frame+1])
                ep_lines[idx].set_data(t[:frame+1], ep[:frame+1])
                em_lines[idx].set_data(t[:frame+1], em[:frame+1])
                artists.extend([ek_lines[idx], ep_lines[idx], em_lines[idx]])
                
        # update untuk teks waktunyaa
        if hasil_simulasi and len(hasil_simulasi[0]['data'][0]) > 0:
            t_ref = hasil_simulasi[0]['data'][0]
            current_time = t_ref[min(frame, len(t_ref)-1)]
            time_text_energy.set_text(f'Waktu: {current_time:.2f} s')
        artists.append(time_text_energy)
        
        return tuple(artists)
    
    def init():
        dynamic_lines = ball_points + ek_lines + ep_lines + em_lines 
        for line in dynamic_lines:
            line.set_data([], [])
            
        time_text_energy.set_text('')
        
        return tuple(path_lines + ball_points + ek_lines + ep_lines + em_lines + [time_text_energy])

    anim = FuncAnimation(fig, update, frames=1000, init_func=init, 
                         interval=dt * 1000, blit=True, repeat=False)
    
    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    plt.show() 

def simpan_csv(hasil_simulasi, filename="hasil_simulasi_dinamika_energi.csv"):
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Bola", "t (s)", "x (m)", "y (m)", "EK (J)", "EP (J)", "EM (J)"])

        for data in hasil_simulasi:
            nama = data['nama']
            t, x, y, ek, ep, em = data['data']

            for i in range(len(t)):
                writer.writerow([
                    nama,
                    f"{t[i]:.4f}",
                    f"{x[i]:.4f}",
                    f"{y[i]:.4f}",
                    f"{ek[i]:.4f}",
                    f"{ep[i]:.4f}",
                    f"{em[i]:.4f}"
                ])

    print(f"CSV berhasil disimpan sebagai {filename}")

# akhirnya utama juga.....
nama = input("Masukkan nama kamu<3: ")
print("-" * 50)

jalankan = True # utamaaa
masuk_menu = False 
simulasi_dimulai_haha = False 

while jalankan:
    if not masuk_menu:
        jawab = input(f"Hai {nama}!! Apakah kamu mau memulai simulasi ini? \n(Ketik 'y' untuk yes, 'n' untuk keluar program ini.)\n").lower()
        
        if jawab == "y":
            masuk_menu = True
        elif jawab == "n":
            print("Okayy deh:(, Semangat yaah! Program akan dimatikan.")
            jalankan = False
            continue 
        
        else:
            print("❌ Pilihannya yang bener dong! Coba lagi yaa.")
            continue
        
    # menu dijalankan
    if masuk_menu:
        menu() 
        
        try:
            opsi = input("Masukkan nomor opsi (1-4) yah: ")
            pilihan = int(opsi)
            
            if pilihan == 1:
                print("\n--> [PROSES: Memulai Simulasi & Plot...]\n")
                simulasi_dimulai_haha = True
            elif pilihan == 2:
                print("\n--> [PROSES: Menampilkan Penjelasan Simulasi...]\n")
                print("-" * 50)
                input(f"{penjelasan_pengguna} \n Kembali? (tekan enter yaak!) \n").lower()
            elif pilihan == 3:
                print("\n--> [PROSES: Menampilkan Bantuan Pengguna...]\n")
                print("-" * 50)
                input(f"{bantuan_pengguna} \n Kembali? (tekan enter yaak!) \n").lower()
            elif pilihan == 4:
                print("\nOkayy deh, keluar dari menu simulasi.\n")
                masuk_menu = False
            else:
                print("❌ Nomor opsi tidak valid nih. Masukkan antara 1 hingga 4 yaa~")
                
        except ValueError:
            print("⚠️ Input harus berupa angka loh, coba lagi.")
            
    # menu simulasi 
    # (dipanggil kalau opsi 1 dipilih)
    if simulasi_dimulai_haha:
        hasil = simulasi_dimulai_fungsi() 
        
        if hasil:
            # untuk fungsi plot/animasi
            simpan_csv(hasil)
            buat_animasi_gabungan(hasil)
        # reset lagi setelah selesai simulasi
        simulasi_dimulai_haha = False
