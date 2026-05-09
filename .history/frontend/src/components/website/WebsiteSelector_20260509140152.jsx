import React, {
  useEffect,
  useState
} from 'react';

import {
  websiteApi,
  setWebsite
} from '../../services/api';

const WebsiteSelector = ({
  onSelected
}) => {

  const [websites, setWebsites] =
    useState([]);

  const [name, setName] =
    useState('');

  const [slug, setSlug] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    fetchWebsites();

  }, []);

  const fetchWebsites =
    async () => {

      try {

        const res =
          await websiteApi.getAll();

        setWebsites(
          res.data.data || []
        );

      } catch (err) {

        console.error(err);
      }
    };

  const createWebsite =
    async () => {

      if (!name || !slug) {

        return alert(
          'Enter website name and slug'
        );
      }

      try {

        setLoading(true);

        const res =
          await websiteApi.create({
            name,
            slug
          });

        setWebsite(
          res.data.data
        );

        onSelected();

      } catch (err) {

        alert(
          err.message
        );
      } finally {

        setLoading(false);
      }
    };

  const selectWebsite =
    (website) => {

      setWebsite(website);

      onSelected();
    };

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">

    <div className="bg-white w-full max-w-lg rounded-xl p-6 max-h-[80vh] overflow-hidden flex flex-col">

        <h2 className="text-2xl font-bold mb-6">
          Select Website
        </h2>

        {/* EXISTING WEBSITES */}
<div className="flex-1 overflow-y-auto pr-1"></div>
        {websites.length > 0 && (

          <div className="mb-6">

            <h3 className="font-semibold mb-3">
              Existing Websites
            </h3>

            <div className="space-y-2">

              {websites.map(
                (website) => (

                  <button
                    key={website.id}
                    onClick={() =>
                      selectWebsite(
                        website
                      )
                    }
                    className="w-full text-left border rounded-lg p-3 hover:bg-gray-100"
                  >

                    <div className="font-medium">
                      {website.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      /{website.slug}
                    </div>

                  </button>
                )
              )}

            </div>

          </div>
        )}

        {/* CREATE */}

        <div className="border-t pt-6">

          <h3 className="font-semibold mb-3">
            Create New Website
          </h3>

          <input
            type="text"
            placeholder="Website Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="w-full border rounded-lg px-4 py-2 mb-3"
          />

          <input
            type="text"
            placeholder="website-slug"
            value={slug}
            onChange={(e) =>
              setSlug(
                e.target.value
                  .toLowerCase()
              )
            }
            className="w-full border rounded-lg px-4 py-2 mb-4"
          />

          <button
            onClick={createWebsite}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >

            {loading
              ? 'Creating...'
              : 'Create Website'}

          </button>

        </div>

      </div>

    </div>
  );
};

export default WebsiteSelector;