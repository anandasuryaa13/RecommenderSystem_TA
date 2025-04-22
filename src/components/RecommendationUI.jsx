import React, { useState, useEffect } from 'react';

// Komponen HTML pengganti UI library
const Card = ({ children, className }) => <div className={`border rounded p-4 shadow ${className}`}>{children}</div>;
const CardContent = ({ children, className }) => <div className={className}>{children}</div>;
const Button = ({ children, ...props }) => <button {...props} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">{children}</button>;
const Checkbox = ({ checked, onCheckedChange }) => (
  <input type="checkbox" checked={checked} onChange={onCheckedChange} className="form-checkbox" />
);
const Label = ({ children, className }) => <label className={className}>{children}</label>;

const RecommendationUI = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [preference, setPreference] = useState('item');
  const [recommendations, setRecommendations] = useState([]);
  const [allItems, setAllItems] = useState([]);  // State untuk menyimpan daftar barang

  // Ambil daftar barang dari backend saat komponen dimuat
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const BASE_URL = "https://66decc25-a2cd-4922-8b07-89275b3e82e4-00-35iyrzpfynthr.pike.replit.dev.repl.co"; 
        const response = await fetch(`${BASE_URL}/items`);
        const data = await response.json();
        console.log("Data Barang:", data);  // Menampilkan data yang diterima
        setAllItems(data.items);  // Menyimpan daftar items ke state
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
  
    fetchItems();  // Panggil fungsi untuk mendapatkan data
  }, []);  // Hanya dijalankan saat komponen pertama kali dimuat
  
  

  // Fungsi untuk memilih barang
  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Fungsi untuk submit dan mendapatkan rekomendasi
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selected_items: selectedItems,
          preference_type: preference,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);  // Menyimpan rekomendasi yang diterima
    } catch (error) {
      console.error('Error:', error);
      setRecommendations([]);  // Jika error, kosongkan rekomendasi
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 bg-blue-500 text-white p-2 rounded">
        Sistem Rekomendasi KNN
      </h2>

      <Card className="mb-4">
        <CardContent className="space-y-2">
          <h3 className="font-semibold">1. Pilih Barang yang Dibeli:</h3>
          <div className="grid grid-cols-2 gap-2">
            {allItems.length > 0 ? (
              allItems.map((item) => (
                <Label key={item} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedItems.includes(item)}
                    onCheckedChange={() => toggleItem(item)}
                  />
                  <span>{item}</span>
                </Label>
              ))
            ) : (
              <p>Memuat barang...</p>  // Jika data belum tersedia
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="space-y-2">
          <h3 className="font-semibold">2. Pilih Preferensi Rekomendasi:</h3>
          <div className="flex gap-4">
            {['item', 'user', 'brand'].map((type) => (
              <Label key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="preference"
                  value={type}
                  checked={preference === type}
                  onChange={() => setPreference(type)}
                />
                <span>{type}</span>
              </Label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSubmit} disabled={selectedItems.length === 0}>
        Tampilkan Rekomendasi
      </Button>

      {recommendations.length > 0 && (
        <Card className="mt-4">
          <CardContent className="space-y-2">
            <h3 className="font-semibold">Rekomendasi untukmu:</h3>
            <ul className="list-disc list-inside">
              {recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecommendationUI;
