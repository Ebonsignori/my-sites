import Link from "next/link";
import { useMemo, useState } from "react";
import styled from "styled-components";

import SearchIcon from "../svgs/search-icon";
import UpDownIcon from "../svgs/up-down-icon";
import { setEachBreakpoint } from "../utils/breakpoints";
import Select, { SelectedAndOptionsBreakpoints } from "./select";

export default function Header({
  headerRef,
  title,
  titleUrl,
  subtitle,
  navLinks,
  tags,
  search,
  sortBy,
}) {
  const [navOpen, setNavOpen] = useState(false);
  const NavRender = useMemo(() => {
    return navLinks.map((navLink) => (
      <Link href={navLink.active ? "" : navLink.url} passHref key={navLink.url}>
        <NavLink active={navLink.active}>{navLink.name}</NavLink>
      </Link>
    ));
  }, [navLinks]);

  const TagsRender = useMemo(() => {
    if (!tags) {
      return null;
    }
    return tags.map((currentTags) => {
      return (
        <FilterWrapper key={currentTags.pluralName || "tags"}>
          <Select config={currentTags} />
        </FilterWrapper>
      );
    });
  }, [tags]);

  const SortByRender = useMemo(() => {
    if (!sortBy) {
      return null;
    }

    return (
      <FilterWrapper key="sort-by-wrapper">
        <Select
          config={{
            pluralName: "Sorting",
            icon: <UpDownIcon />,
            multiple: false,
            selected: sortBy.sortBy.label,
            setSelected: sortBy.setSortBy,
            options: sortBy.options,
          }}
        />
      </FilterWrapper>
    );
  }, [sortBy]);

  const SearchRender = useMemo(() => {
    if (!search) {
      return null;
    }
    return (
      <SearchWrapper key="search-wrapper" isOdd={(tags.length + 2) % 3 === 0}>
        <span>
          <StyledSearchIcon />
        </span>
        <Search
          value={search.search}
          type="text"
          onChange={(e) => search.setSearchQuery(e.target.value)}
        />
      </SearchWrapper>
    );
  }, [search, tags]);

  const TitleRender = useMemo(() => {
    if (titleUrl) {
      return (
        <Link href={titleUrl} passHref>
          <Title isLink>{title}</Title>
        </Link>
      );
    }
    return <Title>{title}</Title>;
  }, [title, titleUrl]);

  return (
    <HeaderWrapper ref={headerRef}>
      <HeaderContainer>
        <FirstRow>
          <TitleWrapper>
            {TitleRender}
            <SubTitle>{subtitle}</SubTitle>
          </TitleWrapper>
          <NavLinks>{NavRender}</NavLinks>
          <NavLinksMobile navOpen={navOpen}>
            <button name="close" onClick={() => setNavOpen((prev) => !prev)}>
              &times;
            </button>
            <div>{NavRender}</div>
          </NavLinksMobile>
          <NavMobileOpen
            navOpen={navOpen}
            onClick={() => setNavOpen((prev) => !prev)}
          >
            &#x2630;
          </NavMobileOpen>
        </FirstRow>
        {(tags || search) && (
          <SecondRow>
            {SortByRender}
            {TagsRender}
            {SearchRender}
          </SecondRow>
        )}
      </HeaderContainer>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: center;
`;

const HeaderContainerBreakpoints = setEachBreakpoint({
  xs: `
    margin-top: 30px;
    margin-bottom: 10px;
  `,
  md: `
    max-width: 100%;
  `,
  lg: `
    max-width: 100%;
  `,
  xl: `
    max-width: 100%;
  `,
  xxl: `
    max-width: 100%;
  `,
});
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px;
  width: 100%;
  margin-top: 50px;
  @media (max-width: 639px) {
    max-width: 100%;
  }
  @media (min-width: 640px) {
    max-width: 700px;
  }
  ${HeaderContainerBreakpoints}
`;
const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;
  justify-content: space-evenly;
`;

const SecondRowBreakpoints = setEachBreakpoint({
  xs: `
  justify-content: flex-start;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 2fr;
  `,
  sm: `
  grid-template-columns: repeat(2, 45%);
  grid-template-rows: 2fr;
  `,
  md: `
  grid-template-columns: repeat(2, 30%);
  grid-template-rows: 2fr;
  `,
  lg: `
  display: flex;
    justify-content: center;
    div {
    margin-right: .8rem;

    }
  `,
  xl: `
  display: flex;
    justify-content: center;
    div {
    margin-right: .8rem;

    }
  `,
  xxl: `
  display: flex;
    justify-content: center;
    div {
    margin-right: 1rem;

    }
  `,
});
const SecondRow = styled.div`
  display: grid;
  justify-content: center;
  justify-items: center;
  ${SecondRowBreakpoints}
  @media (max-width: 325px) {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: 1fr;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  user-select: none;
`;

const TitleBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 2.5rem;
  `,
  sm: `
  font-size: 2.5rem;
  `,
  md: `
  font-size: 2.5rem;
  `,
  lg: `
  font-size: 3rem;
  `,
  xl: `
  font-size: 4rem;
  `,
  xxl: `
  font-size: 5rem;
  `,
});
const TitleProps = (props) =>
  props.isLink &&
  `
  :hover {
    cursor: pointer;
    color: var(--primary);
  }
`;
export const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  line-height: 1em;
  ${TitleBreakpoints}
  ${TitleProps}
`;

const SubTitleBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 1.175rem;
  `,
  sm: `
  font-size: 1.25rem;
  `,
  md: `
  font-size: 1.25rem;
  `,
  lg: `
  font-size: 1.5rem;
  `,
  xl: `
  font-size: 2rem;
  `,
  xxl: `
  font-size: 2.5rem;
  `,
});
export const SubTitle = styled.h2`
  color: var(--secondary);
  margin: 0;
  font-weight: 300;
  font-size: 1rem;
  line-height: 1em;
  margin-left: 0.5em;
  ${SubTitleBreakpoints}
`;

const FilterBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 1.1rem;
  line-height: 1.4rem;
  `,
  sm: `
  font-size: 1.2rem;
  line-height: 2.2rem;
  `,
  md: `
  font-size: 1.2rem;
  line-height: 2rem;
  `,
  lg: `
  font-size: 1.1rem;
  line-height: 2rem;
  `,
  xl: `
  font-size: 1.4rem;
  line-height: 2rem;
  `,
  xxl: `
  font-size: 1.8rem;
  line-height: 2rem;
  `,
});

const FilterWrapper = styled.div`
  font-family: var(--main-family), sans-serif;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 1rem;
  margin-bottom: 18px;
  select {
    margin-left: 0.5rem;
  }
  span {
    display: flex;
    align-content: flex-end;
    height: 2.2rem;
    width: 2.2rem;
    fill: var(--background-accent);
    z-index: 2;
  }
  ${FilterBreakpoints}
`;

const SearchWrapperProps = (props) =>
  props.isOdd &&
  `
  grid-column: 1 / 3;
  @media (max-width: 325px) {
    grid-column: 1;
  }

`;
const SearchWrapper = styled(FilterWrapper)`
  margin-right: 1rem;
  margin-bottom: 18px;
  min-width: 200px;
  ${SelectedAndOptionsBreakpoints}
  span {
    margin-right: 0.8rem;
  }
  @media (max-width: 325px) {
    min-width: 95%;
  }
  ${SearchWrapperProps}
`;

const SearchBreakpoints = setEachBreakpoint({
  xs: `
    width: 120px;
  `,
});
const Search = styled.input`
  display: block;
  width: 180px;
  height: auto;
  background-color: inherit;
  border: none;
  border-bottom: 1px solid var(--background-accent);
  color: var(--font);
  padding: 0;
  transition: width 0.5s;
  transition: visibility 0.51s, 0.1s;
  font-size: 1.2rem;
  line-height: 2.2rem;
  ${SearchBreakpoints}
  @media (max-width: 410px) {
    width: 100px;
  }
  @media (max-width: 360px) {
    width: 80px;
  }
  @media (max-width: 325px) {
    width: 200px;
  }

  :focus {
    border-bottom: 1px solid var(--primary);
  }
  ${FilterBreakpoints}
`;
const StyledSearchIcon = styled(SearchIcon)`
  height: auto;
  width: 2.2rem;
  fill: var(--background-accent);
`;

const NavLinkBreakpoints = setEachBreakpoint({
  xs: `
  font-size: 3rem;
  font-weight: 400;
  color: var(--secondary);
  margin: auto;
  `,
  sm: `
  font-size: 3rem;
  font-weight: 400;
  color: var(--secondary);
  margin: auto;
  `,
  md: `
    font-size: 1.5rem;
    font-style: italic;
  `,
  lg: `
    font-size: 2rem;
    margin-left: 4rem;
    font-style: italic;
  `,
  xl: `
    font-size: 3rem;
    margin-left: 5rem;
    font-style: italic;
  `,
  xxl: `
    font-size: 4rem;
    margin-left: 6rem;
    font-style: italic;
  `,
});
const NavLinkPropsBreakpoints = setEachBreakpoint({
  xs: `
    color: var(--background) !important;
  `,
  sm: `
    color: var(--background) !important;
  `,
});
const NavLinkProps = (props) =>
  props.active &&
  `
  font-weight: 600;
  color: var(--font);
  :hover {
    cursor: default;
    color: var(--font);
  }
  ${NavLinkPropsBreakpoints}
`;
const NavLink = styled.a`
  font-weight: 200;
  margin-left: 3rem;
  line-height: 3rem;
  white-space: nowrap;
  min-width: fit-content;
  font-family: var(--accent-family);
  color: var(--font-secondary);
  :hover {
    cursor: pointer;
    color: var(--primary);
  }
  ${NavLinkBreakpoints}
  ${NavLinkProps}
`;
const NavLinksBreakpoints = setEachBreakpoint({
  xs: `
  display: none;
  `,
  sm: `
  display: none;
  `,
});
const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  user-select: none;
  ${NavLinksBreakpoints}
`;
const NavLinksMobileBreakpoints = setEachBreakpoint({
  xs: `
  div {
      min-height: 65%;
  }
  `,
  md: `
  display: none;
  `,
  lg: `
  display: none;
  `,
  xl: `
  display: none;
  `,
  xxl: `
  display: none;
  `,
});
const NavLinksMobile = styled.nav`
  user-select: none;
  position: fixed;
  z-index: 5;
  right: 0;
  top: 0;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.9);
  overflow-x: hidden;
  transition: 0.5s;
  height: 100%;
  width: 0;
  ${(props) => props.navOpen && `width: 100%;`}

  div {
    position: relative;
    top: 15%;
    width: 100%;
    min-height: 40%;
    margin-top: 30px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  button {
    z-index: 10;
    position: absolute;
    top: 15px;
    right: 30px;
    font-size: 4rem;
    border: none;
    padding: 0;
    text-decoration: none;
    color: var(--background);
    display: block;
    transition: 0.3s;
    background-color: rgba(0, 0, 0, 0);
    appearance: none;
    :hover {
      cursor: pointer;
      color: var(--background-accent);
      opacity: 0.7;
    }
  }

  ${NavLinksMobileBreakpoints}
`;
const NavMobileOpen = styled.span`
  user-select: none;
  visibility: visible;
  opacity: 1;
  ${(props) => props.navOpen && `visibility: hidden; opacity: 0;`}
  font-size: 2rem;
  transition: 0.3s linear;
  vertical-align: text-top;
  margin-left: auto;
  ${NavLinksMobileBreakpoints}
  :hover {
    cursor: pointer;
    color: var(--primary);
  }
`;
