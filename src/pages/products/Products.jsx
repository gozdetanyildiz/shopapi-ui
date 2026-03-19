import { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../../api/products';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      setError('Ürünler yüklenemedi!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert('Ürün silinemedi!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">ShopAPI</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Hoş geldin, {user?.username}</span>
          <button
            onClick={() => navigate('/orders')}
            className="text-sm text-blue-600 hover:underline"
          >
            Siparişlerim
          </button>
          <button
            onClick={logoutUser}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
          >
            Çıkış
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Ürünler</h2>
          <button
            onClick={() => navigate('/products/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Yeni Ürün
          </button>
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
        )}

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  Stok: {product.stock}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  ₺{product.price?.toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/products/edit/${product.id}`)}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && products.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Henüz ürün eklenmemiş.
          </div>
        )}
      </div>
    </div>
  );
}