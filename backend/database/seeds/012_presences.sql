-- Data presensi untuk mahasiswa di kelas yang berbeda
INSERT INTO presence (id, class_enrollment_id, status, late_time) VALUES
(1, 7, 'hadir', 0), -- mhs 1, class 1
(2, 8, 'hadir', 5), -- mhs 2, class 1
(3, 9, 'izin', 0), -- mhs 5, class 1
(4, 10, 'hadir', 0), -- mhs 1, class 2
(5, 11, 'sakit', 0), -- mhs 2, class 2
(6, 12, 'alpha', 0), -- mhs 2, class 3
(7, 13, 'hadir', 15), -- mhs 3, class 4
(8, 14, 'hadir', 0), -- mhs 3, class 5
(9, 15, 'hadir', 0), -- mhs 5, class 10
(10, 7, 'hadir', 0); -- mhs 1, class 1 (another day)
