import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency-decorators";
import { inject as service } from "@ember/service";

const STEPS = {
  NETWORK_NAME: "NETWORK_NAME",
  NETWORK_PASSWORD: "NETWORK_PASSWORD",
  APPLYING_SETTINGS: "APPLYING_SETTINGS",
};

export default class NewSetupComponent extends Component {
  @service currentDevice;

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
    yield event.preventDefault();
  }

  goToStep(newStep) {
    this.currentStep = newStep;
  }
}
