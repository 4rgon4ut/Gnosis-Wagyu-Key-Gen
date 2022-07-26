import { Button, Tooltip, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import { paths, tooltips } from "../constants";
import { GlobalContext } from "../GlobalContext";
import { KeyIcon } from "../icons/KeyIcon";
import NetworkPickerModal from "../modals/NetworkPickerModal";
import ReuseMnemonicActionModal from "../modals/ReuseMnemonicActionModal";
import { ReuseMnemonicAction } from "../types";

/**
 * Landed page of the application.
 * The user will be able to select a network and choose the primary action
 * they wish to make.
 */
const Home = () => {
  const { network } = useContext(GlobalContext);
  const [wasNetworkModalOpened, setWasNetworkModalOpened] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showReuseMnemonicModal, setShowReuseMnemonicModal] = useState(false);
  const [createMnemonicSelected, setCreateMnemonicSelected] = useState(false);
  const [useExistingMnemonicSelected, setUseExistingMnemonicSelected] = useState(false);

  let history = useHistory();

  const tabIndex = useMemo(() => showNetworkModal ? -1 : 1, [showNetworkModal]);

  const handleOpenNetworkModal = () => {
    setShowNetworkModal(true);
    setWasNetworkModalOpened(true);
  };

  const handleCloseNetworkModal = () => {
    setShowNetworkModal(false);
    if (createMnemonicSelected) {
      handleCreateNewMnemonic();
    } else if (useExistingMnemonicSelected) {
      handleUseExistingMnemonic();
    }
  };

  const handleCreateNewMnemonic = () => {
    setCreateMnemonicSelected(true);

    if (!wasNetworkModalOpened) {
      handleOpenNetworkModal();
    } else {
      history.push(paths.CREATE_MNEMONIC)
    }
  };

  const handleUseExistingMnemonic = () => {
    setUseExistingMnemonicSelected(true);

    if (!wasNetworkModalOpened) {
      handleOpenNetworkModal();
    } else {
      setShowReuseMnemonicModal(true);
    }
  };

  const handleCloseReuseActionModal = () => {
    setShowReuseMnemonicModal(false);
  };

  const handleReuseMnemonicActionSubmit = (action: ReuseMnemonicAction) => {
    setShowReuseMnemonicModal(false);
    if (action === ReuseMnemonicAction.RegenerateKeys) {

      history.push(paths.EXISTING_IMPORT);
    } else if (action === ReuseMnemonicAction.GenerateBLSToExecutionChange) {

      history.push(paths.BTEC_IMPORT);
    }
  };

  return (
    <div className="tw-flex tw-flex-col tw-pt-8">
      <div className="tw-pr-8 tw-text-right tw-w-full">
        <span className="tw-text-gray tw-text-sm">Select Network:</span>{" "}
        <Button
          color="primary"
          onClick={handleOpenNetworkModal}
          tabIndex={tabIndex}
        >
          {network}
        </Button>
      </div>

      <div className="tw-flex tw-flex-col tw-items-center tw-mt-4">
        <Typography className="tw-text-4xl tw-mb-5" variant="h1">Welcome!</Typography>

        <KeyIcon />

        <Typography className="tw-mt-2">Your key generator for staking on Ethereum.</Typography>
        <Typography>
          You should run this tool{" "}
          <Tooltip title={tooltips.OFFLINE}>
            <span className="tw-underline">offline</span>
          </Tooltip>{" "}
          for your own security.
        </Typography>

        <div className="tw-mt-5">
          <div>
            <span className="tw-text-gray">Github:</span>{" "}
            <span className="tw-text-sm">https://github.com/stake-house/wagyu-key-gen</span>
          </div>
          <div>
            <span className="tw-text-gray">Support:</span>{" "}
            <span className="tw-text-sm">https://dsc.gg/ethstaker</span>
          </div>
        </div>
      </Modal>

      <LandingHeader variant="h1"><b>Welcome to the Gnosis Wagyu Key Generator</b></LandingHeader>
      <LandingHeader variant="h1">USE AT YOUR OWN RISK</LandingHeader>
      <KeyIcon />
      <SubHeader variant="h2">Your key generator for Gnosis Beacon Chain</SubHeader>
      <SubHeader variant="h2"><b>THIS IS PRE-RELEASE SOFTWARE NOT INTENDED FOR PRODUCTION USE AT THIS TIME</b></SubHeader>

      <Links>
        <InfoLabel>Github:</InfoLabel> https://github.com/alexpeterson91/wagyu-key-gen/issues
        <br />
        <InfoLabel>Support:</InfoLabel> https://discord.gg/dappnode
        <br />
        <InfoLabel>Powered by Stake-House:</InfoLabel> https://github.com/stake-house/wagyu-key-gen

      </Links>

      <OptionsGrid container spacing={2} direction="column">
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleCreateNewMnemonic} tabIndex={tabIndex(1)}>
            Create New Mnemonic Recovery Phrase
          </Button>
        </Grid>
        <Grid item>
          <Tooltip title={tooltips.IMPORT_MNEMONIC}>
            <Button variant="contained" color="primary" onClick={handleUseExistingMnemonic} tabIndex={tabIndex(1)}>
              Use Existing Mnemonic Recovery Phrase
            </Button>
          </Tooltip>
        </Grid>
      </OptionsGrid>
      <VersionFooter />
    </StyledMuiContainer>
  );
};

export default Home;
