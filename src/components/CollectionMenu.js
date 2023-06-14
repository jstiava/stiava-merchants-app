import React, { useState } from 'react';

const CollectionMenu = (props) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.getAttribute('data-value'));
    setIsDropdownOpen(false);
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  console.log(props);

  return (
    <div className="dropdown">
      <div className='dropdown-icon' style={{backgroundImage: 'url(' + props.icon + ')'}}></div>
      <button className="dropdown-toggle" onClick={handleToggleDropdown}>
        {props.value}
      </button>
      {isDropdownOpen && (
        <div className="dropdown-options">
          {props.children.map((option) => (
            <p key={option.props.title}>{option.props.title}</p>
          ))}
        </div>
      )}
      {selectedOption && (
        <div>
          <strong>{selectedOption}</strong>
          <p>Description for {selectedOption}</p>
        </div>
      )}
    </div>
  );
};

export default CollectionMenu;
