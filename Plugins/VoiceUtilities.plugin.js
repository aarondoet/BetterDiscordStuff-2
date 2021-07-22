/**
 * @name VoiceUtilities
 * @author Taimoor Tariq
 * @description Add useful options for voice channels.
 * @version 1.0.0
 * @authorId 220161488516546561
 * @donate https://paypal.me/TaimoorTariq2000
 */

 module.exports = class VoiceUtilities {
    load() {} // Optional function. Called when the plugin is loaded in to memory

    start() {} // Required function. Called when the plugin is activated (including after reloads)
    stop() {} // Required function. Called when the plugin is deactivated

    observer(changes) {} // Optional function. Observer for the `document`. Better documentation than I can provide is found here: <https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver>
}