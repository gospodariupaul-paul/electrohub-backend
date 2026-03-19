"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axiosInstance
      .get("/favorites", { withCredentials: true })
      .then((res) => {
        const safeData = res.data.filter((f: any) => f?.product);
        setFavorites(safeData);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔥 AICI ESTE FIX-UL REAL
  const removeFromList = async (productId: number) => {
    try {
      await axiosInstance.delete(`/favorites/${productId}`, {
        withCredentials: true,
      });

      setFavorites((prev) =>
        prev.filter((f: any) => f.product?.id !== productId)
      );
    } catch (err) {
      console.error("Eroare la ștergerea din favorite:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Se încarcă favoritele...
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-xl font-semibold text-white gap-6">
        <div>Nu ai produse la favorite încă ❤️</div>

        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
        >
          Înapoi la homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b141a] text-white px-4 py-8">
      <div className="max-w-6xl mx-auto mb-6">
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
        >
          Înapoi la homepage
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((fav: any) => {
          const product = fav.product;
          const image = product?.images?.[0] || "/placeholder.png";

          return (
            <div
              key={fav.id}
              className="bg-[#111b21] p-4 rounded-lg border border-white/10 hover:bg-[#15232b] transition cursor-pointer"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              <img
                src={image}
                className="w-full h-40 object-cover rounded mb-3"
                alt={product.name}
              />

              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-[#00eaff] font-bold">{product.price} lei</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/product/${product.id}`);
                }}
                className="mt-3 px-4 py-2 bg-[#00aaff] text-black rounded-lg font-semibold hover:bg-[#008fcc] transition"
              >
                Vezi detalii produs
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromList(product.id);
                }}
                className="mt-2 text-red-400 underline"
              >
                Șterge din favorite
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
