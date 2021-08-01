import React from "react";

const FilterItem = ({
  name,
  type,
  label,
  onChange,
  options,
  optionLabel,
  value,
  isOpen,
  hanldeToggleFilterCard
}) => {
  const filterConfigRef = React.createRef();
  const handleToggleFilterConfig = ()=>{
      filterConfigRef.current.classList.toggle("isOpen")
  }
  const filterItemMap = {
    text: {
      render: () => (
        <div onClick={handleToggleFilterConfig} className={`filterItem ${isOpen ? "isOpen" : ""}`}>
          <p>
            <span>{label}</span> contains <span>{value}</span>
          </p>
          <i onClick={()=>hanldeToggleFilterCard(name)} class="fas fa-times"></i>
          <div  onClick={e=>e.stopPropagation()} ref={filterConfigRef} className="filterConfig">
            <input
              onChange={onChange}
              autoComplete="off"
              name={name}
              placeholder={`Search ${label}`}
              value={value}
              className="filterInput"
              type="text"
            />
          </div>
        </div>
      ),
    },
    date: {
      render: () => (
        <div onClick={handleToggleFilterConfig} className={`filterItem ${isOpen ? "isOpen" : ""}`}>
          <p>
            <span>{label}</span> contains <span>{value}</span>
          </p>
          <i onClick={()=>hanldeToggleFilterCard(name)} class="fas fa-times"></i>
          <div  onClick={e=>e.stopPropagation()} ref={filterConfigRef} className="filterConfig">
            <input
              onChange={onChange}
              autoComplete="off"
              name={name}
              placeholder={`Search ${label}`}
              value={value}
              className="filterInput"
              type={type}
            />
          </div>
        </div>
      ),
    },
    radio: {
      render: () => (
        <div onClick={handleToggleFilterConfig} className={`filterItem ${isOpen ? "isOpen" : ""}`}>
          <p>
            <span>{label}</span> is <span>{value}</span>
          </p>
          <i onClick={()=>hanldeToggleFilterCard(name)} class="fas fa-times"></i>
          <div onClick={e=>e.stopPropagation()} ref={filterConfigRef} className="filterConfig">
            {options.map((op) => {
              return (
                <div key={op.name} className="filterRadio">
                  <input
                    onChange={onChange}
                    type="radio"
                    id={`html${op[optionLabel]}`}
                    name={name}
                    value={op[optionLabel]}
                    checked={value === op[optionLabel]}
                  />
                  <label htmlFor={`html${op[optionLabel]}`}>
                    {op[optionLabel]}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
  };
  return <>{filterItemMap[type].render()}</>;
};

export default FilterItem;
