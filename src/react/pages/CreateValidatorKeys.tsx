import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import WizardWrapper from "../components/WizardWrapper";
import { Button, Typography } from "@mui/material";
import { CreateKeysExistingPath, CreateMnemonicFlow, CreatePath, ExistingImportPath, ExistingMnemonicFlow, FinishCreatePath, FinishExistingPath } from "../constants";
import { KeyCreationContext } from "../KeyCreationContext";
import FolderSelector from "../components/FolderSelector";
import Loader from "../components/Loader";
import { GlobalContext } from "../GlobalContext";

const CreateValidatorKeys = () => {
  const {
    setFolderLocation,
    index,
    numberOfKeys,
    mnemonic,
    password,
    withdrawalAddress,
  } = useContext(KeyCreationContext);
  const { network } = useContext(GlobalContext);
  const history = useHistory();
  const usingExistingFlow = history.location.pathname === CreateKeysExistingPath;

  const [creatingKeys, setCreatingKeys] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");

  useEffect(() => {
    if (!mnemonic) {
      history.replace(usingExistingFlow ? ExistingImportPath : CreatePath);
    }
  }, []);

  const onFolderSelect = (folder: string) => {
    setSelectedFolder(folder);
  };

  const createKeys = () => {
    setCreatingKeys(true);

    let appendedWithdrawalAddress = withdrawalAddress;

    if (withdrawalAddress !== "" && !withdrawalAddress.toLowerCase().startsWith("0x")) {
      appendedWithdrawalAddress = "0x" + withdrawalAddress;
    }

    setFolderLocation(selectedFolder);

    window.eth2Deposit.generateKeys(
      mnemonic,
      index,
      numberOfKeys,
      network,
      password,
      appendedWithdrawalAddress,
      selectedFolder,
    ).then(() => {
      setCreatingKeys(false);

      history.push(usingExistingFlow ? FinishExistingPath : FinishCreatePath);
    }).catch((error) => {
      const errorMsg = ('stderr' in error) ? error.stderr : error.message;
      setGenerationError(errorMsg);
      setCreatingKeys(false);
      setFolderLocation("");
    })
  };

  const onBackClick = () => {

  };

  const onNextClick = () => {
    if (selectedFolder) {
      createKeys();
    }
  };

  return (
    <WizardWrapper
      actionBarItems={creatingKeys ? [] : [
        <Button variant="contained" color="primary" onClick={() => onBackClick()} tabIndex={3}>Back</Button>,
        <Button variant="contained" color="primary" disabled={!selectedFolder} onClick={() => onNextClick()} tabIndex={2}>Create</Button>,
      ]}
      activeTimelineIndex={2}
      timelineItems={usingExistingFlow ? ExistingMnemonicFlow : CreateMnemonicFlow}
      title="Create Keys"
    >
      { creatingKeys ? (
        <Loader message="The duration of this process depends on how many keys you are generating and the performance of your computer.  Generating one key takes about 30 seconds.  Generating 100 keys may take about 10 minutes." />
      ) : (
        <div className="tw-flex tw-flex-col tw-items-center tw-gap-4">
          <Typography>Choose a folder where we should save your keys.</Typography>

          <FolderSelector onFolderSelect={onFolderSelect} />

          {selectedFolder && <Typography>You've selected: {selectedFolder}</Typography>}

          {generationError && <Typography color="error">{generationError}</Typography>}
        </div>
      )}
    </WizardWrapper>
  )
};

export default CreateValidatorKeys;

