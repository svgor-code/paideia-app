import React, { useEffect, useState } from "react";
import useDidMountEffect from "@components/utilities/hooks";
import { deviceWrapper } from "@components/utilities/Style";
import { useWallet } from "@components/wallet/WalletContext";
import { fetcher } from "@lib/utilities";
import { Box, Container } from "@mui/material";
import { useRouter } from "next/router";
import useSWR from "swr";
import { GlobalContext, IGlobalContext } from "../../lib/AppContext";
import BottomNav from "./nav/BottomNav";
import Nav from "./nav/SideNav";
import TopNav from "./nav/TopNav";
import { IThemeContext, ThemeContext } from "@lib/ThemeContext";
import { DarkTheme, LightTheme } from "@theme/theme";

const DaoTemplate: React.FC = (props) => {
  const themeContext = React.useContext<IThemeContext>(ThemeContext);
  const [showMobile, setShowMobile] = useState<boolean>(false);
  const router = useRouter();
  const [daoSlug, setDaoSlug] = useState("");
  const { dao } = router.query;
  useEffect(() => {
    if (router.isReady && dao != undefined) {
      setDaoSlug(dao.toString());
    }
  }, [router.isReady]);
  const { data: daoData, error: daoError } = useSWR(
    daoSlug != null && daoSlug !== "" && `/dao/${daoSlug}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  console.log(daoSlug);

  const globalContext = React.useContext<IGlobalContext>(GlobalContext);
  useEffect(() => {
    if (daoData) {
      console.log("heeereee", daoData);

      if (localStorage.getItem("theme") === "dark") {
        themeContext.setTheme(
          DarkTheme(
            daoData.design.dark_primary_color,
            daoData.design.dark_primary_color
          )
        );
      } else {
        themeContext.setTheme(
          LightTheme(daoData.design.primary_color, daoData.design.primary_color)
        );
      }
    }
    globalContext.api.setDaoData(daoData);
  }, [daoData]);

  return (
    <>
      <Container maxWidth="xl" disableGutters>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          {/* {!(daoSlug == '' || daoSlug == undefined) && ( */}
          <Nav showMobile={showMobile} setShowMobile={setShowMobile} />
          {/* )} */}

          <Box
            sx={{
              width: deviceWrapper("100%", "calc(100% - 14.5rem)"),
              top: "0",
              left: deviceWrapper("0", "14.5rem"),
              pt: "0rem",
              pb: "1rem",
              zIndex: deviceWrapper("100", "1000"),
            }}
          >
            <TopNav showMobile={showMobile} setShowMobile={setShowMobile} />
            <Box sx={{ width: "100%" }} onClick={() => setShowMobile(false)}>
              {daoError ? "error" : props.children}
            </Box>
            <BottomNav />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default DaoTemplate;
