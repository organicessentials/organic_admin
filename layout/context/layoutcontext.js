import React, { useState } from "react";
import { AuthProvider } from "../../pages/hook/useContext";
export const LayoutContext = React.createContext();

export const LayoutProvider = (props) => {
  const [layoutConfig, setLayoutConfig] = useState({
    ripple: false,
    inputStyle: "outlined",
    menuMode: "static",
    colorScheme: "light",
    theme: "lara-light-indigo",
    scale: 14,
  });

  const [layoutState, setLayoutState] = useState({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  });

  const onMenuToggle = () => {
    if (isOverlay()) {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        overlayMenuActive: !prevLayoutState.overlayMenuActive,
      }));
    }

    if (isDesktop()) {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive,
      }));
    } else {
      setLayoutState((prevLayoutState) => ({
        ...prevLayoutState,
        staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive,
      }));
    }
  };

  const showProfileSidebar = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: !prevLayoutState.profileSidebarVisible,
    }));
  };

  const isOverlay = () => {
    return layoutConfig.menuMode === "overlay";
  };

  const isDesktop = () => {
    return window.innerWidth > 991;
  };

  const value = {
    layoutConfig,
    setLayoutConfig,
    layoutState,
    setLayoutState,
    onMenuToggle,
    showProfileSidebar,
  };

  return (
    <AuthProvider>
      <LayoutContext.Provider value={value}>
        {props.children}
      </LayoutContext.Provider>
    </AuthProvider>
  );
};
