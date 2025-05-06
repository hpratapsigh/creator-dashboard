'use client';

import { useEffect, useState } from 'react';
import axios from '../lib/axiosInstance';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { FiBookmark, FiShare2, FiFlag, FiExternalLink, FiLoader } from 'react-icons/fi';

interface FeedItem {
  id: string;
  title: string;
  source: string;
  link: string;
}

export default function Feed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedFeeds, setSavedFeeds] = useState<FeedItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    axios
      .get('/api/feed/')
      .then((res) => setFeed(res.data))
      .catch((err) => console.error('Error fetching feed:', err))
      .finally(() => setLoading(false));

    if (token) {
      const savedFeedsKey = `savedFeeds_${token}`;
      const saved = JSON.parse(localStorage.getItem(savedFeedsKey) || '[]');
      setSavedFeeds(saved);
    }
  }, []);

  const handleSave = (item: FeedItem) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Login required to save items!');
      return;
    }

    axios
      .get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const userEmail = res.data.email;
        let cr = res.data.credits;
        const savedFeedsKey = `savedFeeds_${userEmail}`;

        const saved = JSON.parse(localStorage.getItem(savedFeedsKey) || '[]');
        const isAlreadySaved = saved.some((post: FeedItem) => post.id === item.id);

        if (!isAlreadySaved) {
          saved.push(item);
          localStorage.setItem(savedFeedsKey, JSON.stringify(saved));
          setSavedFeeds(saved);

          // Add credits +5 only once per post
          axios
            .put(
              '/api/users/me/me',
              { credit: cr+5 },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            .then(() => {
              toast.success('✅ 5 credits added!');
            })
            .catch((err) => {
              console.error('Failed to add credits:', err);
            });
        } else {
          const updatedSavedFeeds = saved.filter((post: FeedItem) => post.id !== item.id);
          localStorage.setItem(savedFeedsKey, JSON.stringify(updatedSavedFeeds));
          setSavedFeeds(updatedSavedFeeds);
          toast('❌ Removed from Dashboard.');
        }
      })
      .catch((err) => {
        console.error('Error fetching user details:', err);
        toast.error('Error saving feed. Try again later.');
      });
  };

  const handleShare = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      toast.success('🔗 Link copied to clipboard!');
    });
  };

  const handleReport = (title: string) => {
    toast('🚩 Thanks for reporting!');
  };

  const isSaved = (item: FeedItem) => {
    return savedFeeds.some((savedItem) => savedItem.id === item.id);
  };

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-8 text-center md:text-left">
            Your Feed
          </h1>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <FiLoader className="text-blue-600 text-4xl animate-spin mb-4" />
              <p className="text-blue-600 text-lg">Loading your personalized feed...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {feed.length ? (
                feed.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border-l-4 border-blue-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300"
                  >
                    <h2 className="font-bold text-xl text-gray-800 mb-2">{item.title}</h2>
                    <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full inline-block mb-4">
                      {item.source}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        <FiExternalLink /> View
                      </a>

                      <button
                        className={`inline-flex items-center gap-1 ${
                          isSaved(item)
                            ? 'bg-red-100 hover:bg-red-200 text-red-700'
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                        } px-4 py-2 rounded-lg font-medium transition-colors text-sm`}
                        onClick={() => handleSave(item)}
                      >
                        <FiBookmark /> {isSaved(item) ? 'Unsave' : 'Save'}
                      </button>

                      <button
                        className="inline-flex items-center gap-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                        onClick={() => handleShare(item.link)}
                      >
                        <FiShare2 /> Share
                      </button>

                      <button
                        className="inline-flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                        onClick={() => handleReport(item.title)}
                      >
                        <FiFlag /> Report
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-xl shadow text-center">
                  <p className="text-gray-600 text-lg">No feed items available.</p>
                  <p className="text-gray-500 mt-2">Check back later for updates!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
