import { browser } from 'protractor';
import { appHost, testName } from '../../../../integration-tests/protractor.conf';
import { isLoaded, createItemButton, createYAMLLink, saveChangesBtn, resourceTitle } from '../../../../integration-tests/views/crud.view';
import { click } from '../../../../packages/console-shared/src/test-utils/utils';
import { isLoaded as yamlIsLoaded, setEditorContent } from '../../../../integration-tests/views/yaml.view';

const vmiFedora = `apiVersion: kubevirt.io/v1alpha3
kind: VirtualMachineInstance
metadata:
  labels:
    special: vmi-fedora
  name: vmi-fedora-${testName}
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

    console.log([appHost, testName])
    beforeAll(async ()=> {
        await browser.get(`${appHost}/k8s/ns/${testName}/virtualization`);
        await isLoaded();
        click(createItemButton);
        click(createYAMLLink);
        await yamlIsLoaded();

    })

    it('create VM via YAML', async ()=> {
        await setEditorContent(vmiFedora);
        await click(saveChangesBtn);
        await isLoaded();

        expect(resourceTitle.getText()).toEqual(`vmi-fedora-${testName}`);
    })
})
