import { h, Component, render } from '../../../js/preact.min.js';
import htm from '../../../js/htm.min.js';
import {ATDevice} from "../../../js/communication/ATDevice.js";

const html = htm.bind(h);
let unknown = L.translate('(unknown) // (unbekannt)')
class TabGeneral extends Component {

    constructor() {
        super();

        TabGeneral.instance = this;
        this.state = {
            mainVersion: unknown,
            newMainVersion: unknown,
            newMainVersionUrl: '',
            btVersion: unknown,
            newBtVersion: unknown,
            newBtVersionUrl: ''
        }

        this.getVersions();
    }

    getVersions() {
        L.HTTPRequest('https://api.github.com/repos/asterics/FLipMouse/releases/latest', 'GET', 'json').then(result => {
            log.warn(result)
            this.setState({
                newMainVersion: L.formatVersion(result['tag_name']),
                newMainVersionUrl: result['html_url']
            });
        });
        L.HTTPRequest('https://api.github.com/repos/asterics/esp32_mouse_keyboard/releases/latest', 'GET', 'json').then(result => {
            log.warn(result['tag_name']);
            this.setState({
                newBtVersion: L.formatVersion(result['tag_name']),
                newBtVersionUrl: result['html_url']
            });
        });
        ATDevice.getVersion().then(result => {
            this.setState({
                mainVersion: result
            });
        })
        ATDevice.getBTVersion().then(result => {
            this.setState({
                btVersion: result || unknown
            });
        })
    }
    
    render() {
        let slots = ATDevice.getSlots();

        return html`
        <h2>${L.translate('General settings // Allgemeine Einstellungen')}</h2>
        <h3>${L.translate('Usage via USB oder Bluetooth // Verwendung über USB oder Bluetooth')}</h3>
        <div class="container-fluid p-0">
            ${slots.map(slot => html`
                <div class="row">
                    <label class="col-md-4" for="${'devicemode' + slot}">${L.translate('Mode for Slot "{?}" // Modus für Slot "{?}"', slot)}</label>
                    <div class="col-md-6">
                        <select class="col-12" id="${'devicemode' + slot}" onchange="${(event) => ATDevice.setDeviceMode(event.target.value, slot)}">
                            <option value="1">USB</option>
                            <option value="2">Bluetooth</option>
                            <option value="3">USB + Bluetooth</option>
                        </select>
                    </div>
                    
                </div>
            `)}
        </div>
        <h2>${L.translate('Firmware versions // Firmware-Versionen')}</h2>
        <h3>FLipMouse Firmware</h3>
        <div class="container-fluid p-0">
            <div class="row">
                <span class="col col-md-4">${L.translate('Installed version // Installierte Version')}</span>   
                <span class="col col-md-3"> ${this.state.mainVersion}</span>   
            </div>
            <div class="row">
                <span class="col col-md-4">${L.translate('Available version // Verfügbare Version')}</span>   
                <a href="${this.state.newMainVersionUrl}" target="_blank" class="col col-md-3"> ${this.state.newMainVersion}</a>   
                <!-- TODO div class="col-12 col-md-4 mt-3 mt-md-0 ${L.isVersionNewer(this.state.mainVersion, this.state.newMainVersion) ? '' : 'd-none'}">
                    <button class="col-12" disabled="${!L.isVersionNewer(this.state.mainVersion, this.state.newMainVersion)}"><span class="sr-only">FLipMouse: </span>${L.translate('Update firmware // Firmware aktualisieren')}</button>   
                </div-->
                <div class="col-12 col-md-4 mt-3 mt-md-0 ${L.isVersionNewer(this.state.mainVersion, this.state.newMainVersion) || this.state.mainVersion === unknown ? 'd-none' : ''}">
                    <span style="color: green">${L.translate('FLipMouse firmware is up-to-date! // FLipMouse Firmware ist aktuell!')}</span>
                </div>
            </div>
        </div>
        <h3 class="mt-5">Firmware Bluetooth-Addon</h3>
        <div class="container-fluid p-0">
            <div class="row">
                <span class="col col-md-4">${L.translate('Installed version // Installierte Version')}</span>   
                <span class="col col-md-3"> ${this.state.btVersion}</span>   
            </div>
            <div class="row">
                <span class="col col-md-4">${L.translate('Available version // Verfügbare Version')}</span>   
                <a href="${this.state.newBtVersionUrl}" target="_blank" class="col col-md-3"> ${this.state.newBtVersion}</a>   
                <div class="col-12 col-md-4 mt-3 mt-md-0 ${L.isVersionNewer(this.state.btVersion, this.state.newBtVersion) ? '' : 'd-none'}">
                    <button class="col-12" disabled="${!L.isVersionNewer(this.state.btVersion, this.state.newBtVersion)}"><span class="sr-only">Bluetooth-Addon: </span>${L.translate('Update firmware // Firmware aktualisieren')}</button>   
                </div>
                <div class="col-12 col-md-4 mt-3 mt-md-0 ${L.isVersionNewer(this.state.btVersion, this.state.newBtVersion) || this.state.btVersion === unknown ? 'd-none' : ''}">
                    <span style="color: green">${L.translate('Bluetooth-Addon firmware is up-to-date! // Bluetooth-Addon Firmware ist aktuell!')}</span>
                </div>
            </div>
        </div>
        `;
    }
}

export {TabGeneral};