import { browser } from 'protractor';
import { appHost, testName } from '../../../../integration-tests/protractor.conf';
import { isLoaded, createItemButton, createYAMLLink, saveChangesBtn, resourceTitle } from '../../../../integration-tests/views/crud.view';
import { vmIsRunning } from '../../../../integration-tests/views/overview.view';
import { isLoaded as yamlIsLoaded, setEditorContent } from '../../../../integration-tests/views/yaml.view';
import { click, createResources, deleteResources } from '@console/shared/src/test-utils/utils';
import { createExampleVMViaYAML, createVMWithYAML } from './utils/utils';
import {
    PAGE_LOAD_TIMEOUT_SECS,
    KUBEVIRT_SCRIPTS_PATH,
    VM_BOOTUP_TIMEOUT_SECS,
  } from './utils/constants/common';
import { execSync } from 'child_process';
import { VirtualMachine } from './models/virtualMachine';
import { getSecret, getConfigMap, getServiceAccount } from './mocks/mocks';

const environmentExpecScriptPath = `${KUBEVIRT_SCRIPTS_PATH}/expect-vm-install-ga.sh`;
const configmapName = 'configmap-mock';
const secretName = 'secret-mock';
const serviceAccountName = 'service-account-mock';
import { VM_ACTION } from './utils/constants/vm';
let vmname = `omri-vmi-fedora-${testName}`

const vmiFedora = `apiVersion: kubevirt.io/v1alpha3
kind: VirtualMachineInstance
metadata:
  labels:
    special: vmi-fedora
  name: ${vmname}
spec:
  domain:
    devices:
      disks:
      - disk:
          bus: virtio
        name: containerdisk
      - disk:
          bus: virtio
        name: cloudinitdisk
      rng: {}
    machine:
      type: ""
    resources:
      requests:
        memory: 1024M
  terminationGracePeriodSeconds: 0
  volumes:
  - containerDisk:
      image: kubevirt/fedora-cloud-container-disk-demo:latest
    name: containerdisk
  - cloudInitNoCloud:
      userData: |-
        #cloud-config
        password: fedora
        chpasswd: { expire: False }
    name: cloudinitdisk`

describe('Create VM using YAML', ()=> {

    const secret = getSecret(testName, secretName);
    const configMap = getConfigMap(testName, configmapName);
    const serviceAccount = getServiceAccount(testName, serviceAccountName);
    let vm: VirtualMachine;

    console.log([appHost, testName])
    beforeAll(async ()=> {
        /*
        await browser.get(`${appHost}/k8s/ns/${testName}/virtualization`);
        await isLoaded();
        click(createItemButton);
        click(createYAMLLink);
        await yamlIsLoaded();
        */
        createResources([secret, configMap, serviceAccount]);
        const vmObj = await createVMWithYAML(vmiFedora, true);
        vm = new VirtualMachine(vmObj.metadata);

    })

    it('create VM via YAML', async ()=> {
        /*
        await setEditorContent(vmiFedora);
        await click(saveChangesBtn);
        await isLoaded();

        expect(resourceTitle.getText()).toEqual(`vmi-fedora-${testName}`);
      
       await vm.navigateToEnvironment();
       await vm.detailViewAction(VM_ACTION.Start);
       */
      await isLoaded();
      
      expect(resourceTitle.getText()).toEqual(`${testName}`);
      await vmIsRunning();
      console.log("vm is running (yay!)")

       console.log(["waiting for exeSync", `${environmentExpecScriptPath} ${vmname} ${vm.namespace} ${vmname}`])
      const out = execSync(
        `expect ${environmentExpecScriptPath} ${vmname} ${vm.namespace} ${vmname}`,
      ).toString()
      .replace(/[\r]+/gm, '');

      console.log("hey look: " + out)
      
    })
})
