import { click, fillInput, jsClick } from '@console/shared/src/test-utils/utils';
import * as view from '../../views/dialogs/networkInterface.view';
import { selectOptionByOptionValue, getSelectOptions, selectItemMenuByText } from '../utils/utils';
import { Network } from '../types/types';
import { modalSubmitButton, saveButton } from '../../views/kubevirtUIResource.view';
import { waitForNoLoaders } from '../../views/wizard.view';

export class NetworkInterfaceDialog {
  async fillName(name: string) {
    await fillInput(view.nicName, name);
  }

  async selectModel(model: string) {
    await click(view.networkModelDropDown);
    await selectItemMenuByText(view.nicModel, model);
  }

  async selectNetwork(network: string) {
    console.log("selectNetwork start")
    await selectOptionByOptionValue(view.nicNetwork, network);
    console.log("selectNetwork done")
  }

  async selectType(type: string) {
    await jsClick(view.typeDropDown);
    await selectItemMenuByText(view.nicType, type);
    console.log("selectType done")
  }

  async fillMAC(mac: string) {
    await fillInput(view.nicMACAddress, mac);
  }

  async getNetworks(): Promise<string[]> {
    return getSelectOptions(view.nicNetwork);
  }

  async create(NIC: Network) {
    await waitForNoLoaders();
    await this.fillName(NIC.name);
    console.log("start selectModel")
    await this.selectModel(NIC.model);
    console.log("start select network")
    await this.selectNetwork(NIC.network);
    await this.selectType(NIC.type);
    await this.fillMAC(NIC.mac);
    await click(modalSubmitButton);
    await waitForNoLoaders();
  }

  async edit(NIC) {
    await waitForNoLoaders();
    if (NIC.name) {
      await this.fillName(NIC.name);
    }
    if (NIC.model) {
      await this.selectModel(NIC.model);
    }
    if (NIC.network) {
      await this.selectNetwork(NIC.network);
    }
    if (NIC.type) {
      await this.selectType(NIC.type);
    }
    if (NIC.mac) {
      await this.fillMAC(NIC.mac);
    }
    await click(saveButton);
    await waitForNoLoaders();
  }
}
