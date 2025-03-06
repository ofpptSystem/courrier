import { events, User } from "../../../data";
import { useState, useEffect } from "react";
import moment from "moment";
import { getArchive } from "../../../api";
import { Store } from "react-data-stores";
import { usePreventAccess } from "../../../utils";

const Archive = () => {
  const [eventsData, setEventData] = events.useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;
  const [userData, setUserData] = User.useStore();
  const [fetchedPages, setFetchedPages] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  usePreventAccess(userData);
  useEffect(() => {
    if (!fetchedPages[currentPage]) {
      try {
        getArchive(userData.token, currentPage).then((res) => {
          if (res[0]) {
            console.log("error", res);
            return;
          }

          // Vérification si c'est un admin global (sans groupe ni département)
          const isGlobalAdmin = !userData.groupId && !userData.departmentId;

          // Filtrer les courriers
          const filteredEvents = res[1].filter((e) => {
            if (isGlobalAdmin) {
              return e.is_courier === 1; // Admin global voit tous les courriers
            }

            // Pour les utilisateurs normaux, filtrer les courriers assignés
            const isAssigned =
              e.assignedTo?.includes(userData.id) ||
              e.groupId === userData.groupId ||
              e.departmentId === userData.departmentId;

            return e.is_courier === 1 && isAssigned;
          });

          setEventData(filteredEvents);
          setFetchedPages((prevPages) => ({
            ...prevPages,
            [currentPage]: filteredEvents,
          }));
          setTotalPages(res[2]);
        });
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    }
  }, [currentPage, userData.token, userData.groupId, userData.departmentId]);

  const currentEvents = fetchedPages[currentPage] || [];
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-[#F0F2F5] py-8">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-center text-[#0078D7]">
          Archive
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentEvents.map((e) => (
            <div
              key={e.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out hover:scale-105 border border-[#FFC107]"
            >
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2 text-[#004A94]">
                  {e.title || "Pas de titre"}
                </h2>
                {e.date && (
                  <p className="text-gray-500 mb-2">
                    {moment(e.date).format("MMMM DD, YYYY")}
                  </p>
                )}
                <p className="text-gray-600 line-clamp-3">
                  {e.description || "Pas de description"}
                </p>
                <button
                  onClick={() => Store.navigateTo(`/courrier/detail/${e.id}`)}
                  className="mt-2 bg-[#0078D7] text-white hover:bg-[#0056b3] font-bold py-2 px-4 rounded transition duration-300"
                >
                  Afficher plus <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          ))}
          {currentEvents.length === 0 && <p>Aucun courrier archivé assigné.</p>}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-[#FFC107] hover:bg-[#F9A602] text-[#0078D7] font-bold py-2 px-4 rounded mr-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition duration-300"
          >
            Precedent
          </button>

          {Array.from(
            { length: Math.ceil(totalPages / eventsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`bg-[#FFC107] hover:bg-[#F9A602] text-[#0078D7] font-bold py-2 px-4 rounded mx-1 transition duration-300 ${
                  currentPage === i + 1 ? "bg-[#0078D7] text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * eventsPerPage >= totalPages}
            className="bg-[#FFC107] hover:bg-[#F9A602] text-[#0078D7] font-bold py-2 px-4 rounded ml-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition duration-300"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Archive;
