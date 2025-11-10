import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import LoadingOverlay from "../components/loadingOverlay.jsx";

const News = () => {
  const { backendUrl } = useContext(AppContext);
  const [newsList, setNewsList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/getNews`);
        setNewsList(data.news.filter(n => n.status)); // only active
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [backendUrl]);

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-6">
      
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide text-blue-900">
          KIRCT <span className="text-blue-700">NEWS</span> <span className="text-red-600">.</span>
        </h2>
        <div className="w-20 h-1 bg-red-600 mx-auto mt-3 mb-5 rounded-full"></div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Stay updated with the latest research highlights, collaborations, and
          innovations from the Kano Independent Research Centre Trust.
        </p>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsList.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelected(item)}
            className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:scale-[1.02] cursor-pointer transition duration-300"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <p className="text-sm text-gray-400 mb-2">{item.date}</p>
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.summary}</p>
              <p className="text-blue-600 mt-4 font-semibold text-sm">
                Read More →
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
            >
              &times;
            </button>
            <img
              src={selected.image}
              alt={selected.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              {selected.title}
            </h2>
            <p className="text-gray-500 text-sm mb-4">{selected.date}</p>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {selected.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
