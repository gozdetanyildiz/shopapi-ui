import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch {
      setError('Siparişler yüklenemedi!');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  const statusLabels = {
    PENDING: 'Beklemede',
    CONFIRMED: 'Onaylandı',
    SHIPPED: 'Kargoda',
    DELIVERED: 'Teslim Edildi',
    CANCELLED: 'İptal Edildi',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">ShopAPI</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Hoş geldin, {user?.username}</span>
          <button
            onClick={() => navigate('/products')}
            className="text-sm text-blue-600 hover:underline"
          >
            Ürünler
          </button>
          <button
            onClick={logoutUser}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
          >
            Çıkış
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Siparişlerim</h2>

        {loading && (
          <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
        )}

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg">{error}</div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Henüz siparişiniz yok.
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Sipariş #{order.id}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>

              <div className="border-t pt-4 space-y-2">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.product?.name} × {item.quantity}
                    </span>
                    <span className="text-gray-600">
                      ₺{(item.unitPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Toplam</span>
                <span className="text-xl font-bold text-blue-600">
                  ₺{order.totalPrice?.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}