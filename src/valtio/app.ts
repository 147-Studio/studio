import { proxy } from "valtio";
import { OddysseyPageSection } from "@/config/section";

export const app = proxy({
  isPreloader: true,
  loaded: false,
  activeLink: window.location.hash
    ? (window.location.hash.replace("#", "") as OddysseyPageSection)
    : ("" as OddysseyPageSection),
  registerInHeader: false,
});

export const setLoaded = (isLoading: boolean) => {
  app.loaded = isLoading;
};

export const setIsPreloader = (isLoading: boolean) => {
  app.isPreloader = isLoading;
};

export const setActiveLink = (section: OddysseyPageSection) => {
  app.activeLink = section;
};

export const setRegisterInHeader = (value: boolean) => {
  app.registerInHeader = value;
};
