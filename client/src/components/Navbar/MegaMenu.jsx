import React from 'react';
import { Link } from 'react-router-dom';

const MegaMenu = ({ category }) => {
  if (!category || !category.subcategories?.length) return null;

  return (
    <div className="mega-menu d-flex flex-wrap">
      {category.subcategories.map((subcat) => (
        <div key={subcat.id} className="mega-menu-column me-5 mb-4">
          <div className="mega-menu-title">{subcat.name}</div>
          <ul className="mega-menu-list list-unstyled">
            {subcat.childCategories?.map((child) => (
              <li key={child.id}>
                <Link to={`/catalog/${child.id}`} className="mega-menu-link">
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MegaMenu;
