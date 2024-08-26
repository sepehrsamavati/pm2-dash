import UIText from "../i18n/UIText";

const constants = Object.freeze({
    appTitle: UIText._appTitle,
    appVersion: process.env.REACT_APP_VERSION ?? '-',
    style: Object.freeze({
        drawerHeaderMinHeight: 86,
        contentContainerMarginTop: 110
    })
});

export default constants;
