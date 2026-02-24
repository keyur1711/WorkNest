import { Link } from 'react-router-dom';
import workspace1 from '../images/austin-distel-wawEfYdpkag-unsplash.jpg';
import workspace2 from '../images/infralist-com-kmIKEGO7Vl4-unsplash.jpg';
import workspace3 from '../images/uneebo-office-design-UgYT5nkXdK4-unsplash.jpg';
import workspace4 from '../images/pawel-chu-ULh0i2txBCY-unsplash.jpg';
import workspace5 from '../images/suryadhityas-NrDZJ9oWV_Y-unsplash.jpg';
import workspace6 from '../images/running-a-successful-coworking-space-5aaa98c0bb414814ce745dc8.jpg';
const workspaceImages = [workspace1, workspace2, workspace3, workspace4, workspace5, workspace6];
export default function SpaceCard({ space, onToggleFavorite, isFavorite, commuteMins }) {
  const spaceId = space._id || space.id;
  const imageIndex = (spaceId ? String(spaceId).length : 0) % workspaceImages.length;
  const spaceImage = space.images?.[0] || workspaceImages[imageIndex];
  const ratingValue = Number(space.rating ?? 0);
  return (
    <Link
      to={`/spaces/${spaceId}`}
      className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
    >
      {}
      <div className="relative h-64 overflow-hidden">
        <img
          src={spaceImage}
          alt={space.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        {}
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1.5 bg-white dark:bg-gray-900 rounded-lg shadow-lg flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {ratingValue > 0 ? ratingValue.toFixed(1) : '0'}
            </span>
          </div>
        </div>
        {}
        <div className="absolute bottom-4 right-4">
          <div className="px-4 py-2 bg-blue-600 rounded-lg shadow-lg">
            <div className="text-white font-bold text-lg">₹{space.pricePerDay}</div>
            <div className="text-blue-100 text-xs font-medium">/day</div>
          </div>
        </div>
      </div>
      {}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {space.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{space.locationText || space.city}</span>
        </div>
        {typeof commuteMins === 'number' && (
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs font-semibold text-green-700 dark:text-green-400">~{commuteMins} min away</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {space.amenities?.slice(0, 2).map((amenity, idx) => (
            <span
              key={idx}
              className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg"
            >
              {amenity}
            </span>
          ))}
          {space.amenities?.length > 2 && (
            <span className="text-xs px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium rounded-lg">
              +{space.amenities.length - 2} more
            </span>
          )}
        </div>
        {onToggleFavorite && (
          <button
            type="button"
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${isFavorite
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(spaceId);
            }}
          >
            {isFavorite ? (
              <>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Saved
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Save
              </>
            )}
          </button>
        )}
      </div>
    </Link>
  );
}