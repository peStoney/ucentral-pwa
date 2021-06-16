import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency-decorators";
import { inject as service } from "@ember/service";
import ENV from "ucentral/config/environment";

const STEPS = {
  NETWORK_NAME: "NETWORK_NAME",
  NETWORK_PASSWORD: "NETWORK_PASSWORD",
  APPLYING_SETTINGS: "APPLYING_SETTINGS",
};

export default class NewSetupComponent extends Component {
  @service currentDevice;
  @service intl;

  @tracked networkName = "";
  @tracked networkPassword = "";
  @tracked currentStep = STEPS.NETWORK_NAME;

  steps = Object.values(STEPS);

  get isNetworkNameConfirmDisabled() {
    return !this.networkName.trim();
  }

  get isNetworkPasswordConfirmDisabled() {
    return !this.networkPassword.trim();
  }

  get isNetworkNameStep() {
    return this.currentStep === STEPS.NETWORK_NAME;
  }

  get isNetworkPasswordStep() {
    return this.currentStep === STEPS.NETWORK_PASSWORD;
  }

  get isApplyingSettingsStep() {
    return this.currentStep === STEPS.APPLYING_SETTINGS;
  }

  @action
  handleNetworkName({ target: { value } }) {
    this.networkName = value;
  }

  @action
  handleNetworkPassword({ target: { value } }) {
    this.networkPassword = value;
  }

  @task
  *submitTask(event) {
    event.preventDefault();

    if (this.isNetworkNameStep) {
      this.goToStep(STEPS.NETWORK_PASSWORD);
    } else if (this.isNetworkPasswordStep) {
      this.goToStep(STEPS.APPLYING_SETTINGS);
      const configureDeviceResponse = yield this.configureDevice();

      if (!configureDeviceResponse.ok) {
        this.goToStep(STEPS.NETWORK_NAME);
      }
      return configureDeviceResponse;
    }
  }

  async configureDevice() {
    try {
      const response = await fetch(
        `${ENV.APP.BASE_API_URL}/api/v1/device/${this.currentDevice.data.serialNumber}/configure`,
        {
          method: "POST",
          body: JSON.stringify({
            ssid: this.networkName,
            password: this.networkPassword,
          }),
        }
      );

      if (!response.ok) {
        return {
          ok: false,
          errorMessage: this.intl.t("errors.somethingWentWrong"),
        };
      }

      return response;
    } catch (error) {
      return {
        ok: false,
        errorMessage: this.intl.t("errors.somethingWentWrong"),
      };
    }
  }

  goToStep(newStep) {
    this.currentStep = newStep;
  }
}
