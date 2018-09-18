//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.md file in the project root for full license information.
//

import { isString } from "util";
import * as sdk from "../../../../../source/bindings/js/microsoft.cognitiveservices.speech.sdk";
import { Settings } from "./Settings";
import { WaveFileAudioInput } from "./WaveFileAudioInputStream";

beforeAll(() => {
    // Override inputs, if necessary
    Settings.LoadSettings();
});

test("testFromSubscription1", () => {
    expect(() => sdk.SpeechConfig.fromSubscription(null, null)).toThrowError();
});

test("testFromSubscription2()", () => {
    expect(() => sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, null)).toThrowError();
});

test("testFromSubscription3", () => {
    expect(() => sdk.SpeechConfig.fromSubscription(null, Settings.SpeechRegion)).toThrowError();
});

test("testFromSubscriptionSuccess", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    expect(s).not.toBeUndefined();
    s.close();
});

test("testGetSubscriptionKey", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    expect(s).not.toBeUndefined();
    expect(s.subscriptionKey).toEqual(Settings.SpeechSubscriptionKey);
    expect(s.getProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_Key])).toEqual(Settings.SpeechSubscriptionKey);

    s.close();
});

test("testGetRegion", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);

    expect(s).not.toBeUndefined();
    expect(Settings.SpeechRegion).toEqual(s.region);

    s.close();
});

test("testFromEndpoint1", () => {
    expect(() => sdk.SpeechConfig.fromEndpoint(null, null)).toThrowError();
});

test("testFromEndpoint2", () => {
    expect(() => sdk.SpeechConfig.fromEndpoint(null, Settings.SpeechRegion)).toThrowError();
});

test("testFromEndpoint3", () => {
    expect(() => sdk.SpeechConfig.fromEndpoint(new URL("http://www.example.com"), null)).toThrowError();
});

test.skip("testFromEndpoint4", () => {
    expect(() => sdk.SpeechConfig.fromEndpoint(new URL("http://www.example.com"), "illegal-subscription")).toThrowError();
});

// TODO use an endpoint that we control so the subscription key is not leaked!
test.skip("testFromEndpointSuccess", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromEndpoint(new URL("http://www.example.com"), "Settings.SpeechSubscriptionKey");

    expect(s).not.toBeUndefined();

    s.close();
});

test("testGetParameters1", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);

    expect(s.region).toEqual(s.getProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_Region], null));
    expect(s.subscriptionKey).toEqual(s.getProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_Key], null));

    s.close();
});

test("TypedParametersAccessableViaPropBag", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);

    s.authorizationToken = "token";
    expect(s.getProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceAuthorization_Token])).toEqual("token");

    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceAuthorization_Token], "new-val");
    expect(s.authorizationToken).toEqual("new-val");

    s.speechRecognitionLanguage = "en-GB";
    expect(s.getProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_RecoLanguage])).toEqual("en-GB");

    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_RecoLanguage], "ru-RU");
    expect(s.speechRecognitionLanguage).toEqual("ru-RU");
});

test("testGetParametersString", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);

    const name: string = "stringName";
    const value: string = "stringValue";

    s.setProperty(name, value);

    expect(isString(s.getProperty(name, null)));

    expect(value).toEqual(s.getProperty(name, null));
    expect(value).toEqual(s.getProperty(name, "some-other-default-" + value));

    s.close();
});

test("testCreateSpeechRecognizer", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);

    const r: sdk.SpeechRecognizer = new sdk.SpeechRecognizer(s);

    expect(r).not.toBeUndefined();
    expect(r instanceof sdk.Recognizer);

    r.close();
    s.close();
});

test.skip("testCreateSpeechRecognizerLanguage1", () => { // Should no settings just work?
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);

    expect(() => new sdk.SpeechRecognizer(s)).toThrowError();

    s.close();
});

test.skip("testCreateSpeechRecognizerLanguage2", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = "illegal-illegal";

    expect(new sdk.SpeechRecognizer(s)).toThrowError();

    s.close();
});

test("testCreateSpeechRecognizerLanguageSuccess", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = "en-US";

    const r: sdk.SpeechRecognizer = new sdk.SpeechRecognizer(s);

    expect(r).not.toBeUndefined();
    expect(r instanceof sdk.Recognizer);

    r.close();
    s.close();
});

test("testCreateSpeechRecognizerStringSuccess", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);

    const f: File = WaveFileAudioInput.LoadFile(Settings.WaveFile);
    const config: sdk.AudioConfig = sdk.AudioConfig.fromWavFileInput(f);

    const r: sdk.SpeechRecognizer = new sdk.SpeechRecognizer(s, config);

    expect(r).not.toBeUndefined();
    expect(r instanceof sdk.Recognizer);

    r.close();
    s.close();
});

// Test
test("testCreateSpeechRecognizerStringString1", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = null;

    expect(() => new sdk.SpeechRecognizer(s)).toThrowError();

    s.close();
});

test.skip("testCreateSpeechRecognizerStringString3", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = "illegal-illegal";

    const f: File = WaveFileAudioInput.LoadFile(Settings.WaveFile);
    const config: sdk.AudioConfig = sdk.AudioConfig.fromWavFileInput(f);

    expect(() => new sdk.SpeechRecognizer(s, config)).toThrowError();

    s.close();
});

test("testCreateSpeechRecognizerStringStringSuccess", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = "en-EN";

    const f: File = WaveFileAudioInput.LoadFile(Settings.WaveFile);
    const config: sdk.AudioConfig = sdk.AudioConfig.fromWavFileInput(f);

    const r: sdk.SpeechRecognizer = new sdk.SpeechRecognizer(s, config);

    expect(r).not.toBeUndefined();

    s.close();
});
test("testCreateIntentRecognizer", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);

    const r: sdk.IntentRecognizer = new sdk.IntentRecognizer(s);

    s.close();
});

test("testCreateIntentRecognizerLanguage1", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = null;

    try {
        const r: sdk.IntentRecognizer = new sdk.IntentRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test.skip("testCreateIntentRecognizerLanguage2", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = "illegal-speechRecognitionLanguage";

    try {
        const r: sdk.IntentRecognizer = new sdk.IntentRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateIntentRecognizerLanguageSuccess", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = "en-US";

    const r: sdk.IntentRecognizer = new sdk.IntentRecognizer(s);

    expect(r).not.toBeUndefined();

    expect(r instanceof sdk.Recognizer);

    r.close();
    s.close();
});

test("testCreateIntentRecognizerStringSuccess", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = "en-US";

    const f: File = WaveFileAudioInput.LoadFile(Settings.WaveFile);
    const config: sdk.AudioConfig = sdk.AudioConfig.fromWavFileInput(f);

    const r: sdk.IntentRecognizer = new sdk.IntentRecognizer(s, config);

    expect(r).not.toBeUndefined();

    expect(r instanceof sdk.Recognizer);

    r.close();
    s.close();
});

test("testCreateTranslationRecognizerStringArrayListOfString1", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateTranslationRecognizerStringArrayListOfString2", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = "illegal";

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateTranslationRecognizerStringArrayListOfString3", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = "en-EN";

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateTranslationRecognizerStringArrayListOfString4", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = "en-EN";

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test.skip("testCreateTranslationRecognizerStringArrayListOfString5", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = "en-EN";
    s.addTargetLanguage("illegal");

    try {

        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateTranslationRecognizerStringArrayListOfStringSuccess", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = "en-EN";
    s.addTargetLanguage("en-US");

    const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
    expect(r).not.toBeUndefined();

    expect(r instanceof sdk.Recognizer);

    r.close();
    s.close();
});

test("testCreateTranslationRecognizerStringArrayListOfStringString2", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], null);
    s.speechRecognitionLanguage = "illegal";

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateTranslationRecognizerStringArrayListOfStringString3", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], null);
    s.speechRecognitionLanguage = "en-EN";

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateTranslationRecognizerStringArrayListOfStringString4", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = "en-EN";
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], "");

    try {

        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateTranslationRecognizerStringArrayListOfStringString5", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], "illegal");
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationVoice], null);
    s.speechRecognitionLanguage = "en-EN";

    try {

        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateTranslationRecognizerStringArrayListOfStringString6", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.speechRecognitionLanguage = "en-EN";
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], "en-US");
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationVoice], null);

    try {

        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test.skip("testCreateTranslationRecognizerStringArrayListOfStringString7", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], "en-US");
    s.speechRecognitionLanguage = "en-EN";

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateTranslationRecognizerStringArrayListOfStringStringSuccess", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], "en-US");
    s.speechRecognitionLanguage = "en-EN";

    const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
    expect(r).not.toBeUndefined();

    expect(r instanceof sdk.Recognizer);

    r.close();
    s.close();
});

test("testCreateTranslationRecognizerWithFileInputStringStringArrayListOfString1", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], null);
    s.speechRecognitionLanguage = "null";

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test.skip("testCreateTranslationRecognizerWithFileInputStringStringArrayListOfString2", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], null);
    s.speechRecognitionLanguage = "illegal";

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});
test("testCreateTranslationRecognizerWithFileInputStringStringArrayListOfStringString1", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], null);

    expect(() => { s.speechRecognitionLanguage = null; }).toThrow();

    s.close();
});

test("testCreateTranslationRecognizerWithFileInputStringStringArrayListOfStringString3", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], null);

    const f: File = WaveFileAudioInput.LoadFile(Settings.WaveFile);
    const config: sdk.AudioConfig = sdk.AudioConfig.fromWavFileInput(f);

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateTranslationRecognizerWithFileInputStringStringArrayListOfStringString4", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], null);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationVoice], null);

    const f: File = WaveFileAudioInput.LoadFile(Settings.WaveFile);
    const config: sdk.AudioConfig = sdk.AudioConfig.fromWavFileInput(f);

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateTranslationRecognizerWithFileInputStringStringArrayListOfStringString5", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], null);
    s.speechRecognitionLanguage = "en-US";
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationVoice], null);

    const f: File = WaveFileAudioInput.LoadFile(Settings.WaveFile);
    const config: sdk.AudioConfig = sdk.AudioConfig.fromWavFileInput(f);

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateTranslationRecognizerWithFileInputStringStringArrayListOfStringString6", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], "");
    s.speechRecognitionLanguage = "en-US";
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationVoice], null);

    const f: File = WaveFileAudioInput.LoadFile(Settings.WaveFile);
    const config: sdk.AudioConfig = sdk.AudioConfig.fromWavFileInput(f);

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test.skip("testCreateTranslationRecognizerWithFileInputStringStringArrayListOfStringString7", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], "illegal");
    s.speechRecognitionLanguage = "en-US";
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationVoice], null);

    const f: File = WaveFileAudioInput.LoadFile(Settings.WaveFile);
    const config: sdk.AudioConfig = sdk.AudioConfig.fromWavFileInput(f);

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateTranslationRecognizerWithFileInputStringStringArrayListOfStringString8", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], "en-US");
    s.speechRecognitionLanguage = "en-US";
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationVoice], null);

    const f: File = WaveFileAudioInput.LoadFile(Settings.WaveFile);
    const config: sdk.AudioConfig = sdk.AudioConfig.fromWavFileInput(f);

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test.skip("testCreateTranslationRecognizerWithFileInputStringStringArrayListOfStringString9", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], "en-US");
    s.speechRecognitionLanguage = "en-US";
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationVoice], "illegal");

    const f: File = WaveFileAudioInput.LoadFile(Settings.WaveFile);
    const config: sdk.AudioConfig = sdk.AudioConfig.fromWavFileInput(f);

    try {
        const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
        fail("not expected");
    } catch (ex) {
        // expected
    }

    s.close();
});

test("testCreateTranslationRecognizerWithFileInputStringStringArrayListOfStringStringSuccess", () => {
    const s: sdk.SpeechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationToLanguages], "en-US");
    s.speechRecognitionLanguage = "en-US";
    s.setProperty(sdk.PropertyId[sdk.PropertyId.SpeechServiceConnection_TranslationVoice], "en-US");

    const f: File = WaveFileAudioInput.LoadFile(Settings.WaveFile);
    const config: sdk.AudioConfig = sdk.AudioConfig.fromWavFileInput(f);

    const r: sdk.TranslationRecognizer = new sdk.TranslationRecognizer(s);
    expect(r).not.toBeUndefined();

    expect(r instanceof sdk.Recognizer);

    r.close();
    s.close();
});

test("testClose", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);

    s.close();
});

test("testGetFactoryImpl", () => {
    const s: sdk.SpeechConfig = sdk.SpeechConfig.fromSubscription(Settings.SpeechSubscriptionKey, Settings.SpeechRegion);

    expect(s).not.toBeUndefined();

});
