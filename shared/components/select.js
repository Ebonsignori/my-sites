import { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import detectOutsideClick from "../../shared/utils/outside-click";
import DropdownIcon from "../svgs/dropdown-icon";
import { setEachBreakpoint } from "../utils/breakpoints";
import { arrayToCSV, capitalizeAll } from "../utils/strings";

const ALL = "all";

export default function Select({ config }) {
  const dropdownRef = useRef(null);
  const { pluralName, icon, multiple, selected, setSelected, includeAll } =
    config;
  const options = useMemo(() => {
    if (includeAll) {
      return [ALL, ...(config.options || [])];
    }
    return config.options;
  }, [config, includeAll]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onOptionSelect = useCallback(
    (option) => {
      setDropdownOpen(false);
      option = typeof option === "string" ? option.toLowerCase() : option;
      if (multiple) {
        return setSelected((prevSelected) => {
          if (prevSelected.includes(option)) {
            return prevSelected.filter((x) => x !== option);
          }
          return [...prevSelected, option];
        });
      }
      setSelected(option);
    },
    [multiple, setSelected]
  );

  const optionsRender = useMemo(() => {
    if (!options) {
      return null;
    }
    return options.map((option) => {
      const optionString = typeof option !== "string" ? option.label : option;
      let isSelected = selected === optionString;
      if (multiple) {
        isSelected = selected.includes(optionString);
      }
      return (
        <Option
          key={`${pluralName}-${optionString}`}
          onClick={() => (isSelected ? () => {} : onOptionSelect(option))}
          isSelected={isSelected}
        >
          {capitalizeAll(optionString)}
        </Option>
      );
    });
  }, [multiple, selected, onOptionSelect, options, pluralName]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  detectOutsideClick(dropdownRef, () => setDropdownOpen(false));

  const selectedRender = useMemo(() => {
    if (!multiple) {
      return capitalizeAll(selected);
    }
    if (selected.length < 3) {
      return arrayToCSV(selected);
    } else {
      return `${selected.length} ${pluralName}`;
    }
  }, [selected, multiple, pluralName]);

  return (
    <>
      <SelectWrapper ref={dropdownRef} key={pluralName}>
        <Selected onClick={toggleDropdown} dropdownOpen={dropdownOpen}>
          {icon && <span>{icon}</span>}
          <SelectedText>{selectedRender}</SelectedText>
          <DropdownIconWrapper dropdownOpen={dropdownOpen}>
            <DropdownIcon />
          </DropdownIconWrapper>
        </Selected>
        <OptionsList dropdownOpen={dropdownOpen}>{optionsRender}</OptionsList>
      </SelectWrapper>
    </>
  );
}

const SelectWrapper = styled.div`
  position: relative;
`;

export const SelectedAndOptionsBreakpoints = setEachBreakpoint({
  xl: `
    min-width: 225px;
  `,
  xxl: `
    min-width: 250px;
  `,
});
const SelectedProps = (props) =>
  props.dropdownOpen &&
  `
  color: var(--primary);
  svg {
    fill: var(--primary);
  }
`;
const Selected = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 200px;
  span {
    margin-right: 0.8rem;
  }
  :hover {
    color: var(--primary);
    cursor: pointer;
    svg {
      fill: var(--primary);
    }
  }
  ${SelectedProps}
  ${SelectedAndOptionsBreakpoints}
`;

const SelectedText = styled.div`
  min-width: 160px;
  border-bottom: 1px solid var(--background-accent);
`;

// Match FilterBreakpoints lineheight for
const OptionsListBreakpoints = setEachBreakpoint({
  xs: `
  top: 1.2rem;
  `,
  sm: `
  top: 2.0rem;
  `,
});
const OptionsListProps = (props) =>
  props.dropdownOpen
    ? `
visibility: visible;
height: 145px;
`
    : `
height: 0px;
`;

const OptionsList = styled.ul`
  z-index: 5;
  background: var(--background);
  border: 1px solid var(--font-secondary);
  border-radius: 5px;
  top: 1.8rem;
  left: 0px;
  padding: 0;
  position: absolute;
  min-width: 200px;
  width: fit-content;
  list-style: none;
  height: 0px;
  max-height: 200px;
  overflow-y: auto;
  transition: height 0.3s;
  transition: visibility 0.31s, 0.1s;
  visibility: hidden;
  ${OptionsListBreakpoints}
  ${OptionsListProps}
  ${SelectedAndOptionsBreakpoints}

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: var(--background);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary);
  }
`;

const OptionProps = (props) =>
  props.isSelected &&
  `
  :hover {
    cursor: default;
  background: var(--background-accent);
  }
  background: var(--background-accent);
`;
const Option = styled.li`
  font-size: 1rem;
  line-height: 2.2rem;
  padding-left: 15px;
  padding-right: 10px;
  :hover {
    cursor: pointer;
    background: var(--primary);
  }
  border-bottom: 1px solid var(--background-accent);
  ${OptionProps}
`;

const DropdownIconWrapperProps = (props) =>
  props.dropdownOpen &&
  `
  svg {
    transform: rotate(180deg)
  }
`;
const DropdownIconWrapper = styled.div`
  display: flex;
  align-items: center;
  svg {
    transition: 0.3s;
    margin-left: 0.3rem;
    width: 1.2rem;
    transform: rotate(0);
  }
  ${DropdownIconWrapperProps}
`;
