import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

const Breadcrumb = ({ breadcrumbs }) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  // Utility: Check if the label is a UUID-like string
  const isUUIDLike = (label) => {
    const compact = label.replace(/\s/g, '').replace(/-/g, '');
    return /^[a-f0-9]{32}$/i.test(compact);
  };

  // Get the current page title from the last breadcrumb item,
  // but avoid showing it in <h5> if it's a UUID
  const currentPageLabel =
    breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard';
  const showHeading = !isUUIDLike(currentPageLabel);

  return (
    <div>
      <nav className="text-gray-500 text-sm" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  className="mx-1 w-3 h-3 text-gray-400"
                  aria-hidden="true"
                />
              )}
              {crumb.isActive ? (
                <span className="font-medium text-org-primary">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-text hover:text-org-primary transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Render title only if it's not a UUID */}
      {showHeading && (
        <h5 className="pt-2 font-bold text-org-primary-dark text-xl md:text-4xl">
          {currentPageLabel === 'Dashboard'
            ? 'Overview Panel'
            : currentPageLabel}
        </h5>
      )}
    </div>
  );
};

Breadcrumb.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      isActive: PropTypes.bool,
    })
  ).isRequired,
};

export default Breadcrumb;
