import * as $_ from "lodash";

import {
  Dropdown,
  DropdownContent,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Lucide,
} from "@/base-components";

import { faker as $f } from "@/utils";
import classnames from "classnames";
import { useState } from "react";

function Main(props) {
  const [searchDropdown, setSearchDropdown] = useState(false);
  const showSearchDropdown = () => {
    setSearchDropdown(true);
  };
  const hideSearchDropdown = () => {
    setSearchDropdown(false);
  };

  return (
    <>
      {/* BEGIN: Top Bar */}
      <div className="top-bar">
        {/* BEGIN: Breadcrumb */}
        <nav
          aria-label="breadcrumb"
          className="-intro-x mr-auto hidden sm:flex"
        >

        </nav>
      </div>
      {/* END: Top Bar */}
    </>
  );
}

export default Main;
