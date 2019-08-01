//
// Copyright (c) Microsoft. All rights reserved.
// See https://aka.ms/csspeech/license201809 for the full license information.
//
using System;
using Microsoft.CognitiveServices.Speech.Internal;
using static Microsoft.CognitiveServices.Speech.Internal.SpxExceptionThrower;

namespace Microsoft.CognitiveServices.Speech.Dialog
{
    /// <summary>
    /// Class that defines configurations for dialog service connector
    /// Added in version 1.5.0
    /// </summary>
    public sealed class DialogServiceConfig : SpeechConfig
    {
        internal DialogServiceConfig(IntPtr handle) : base(handle)
        {
        }

        /// <summary>
        /// Creates an instance of the dialog service config with the specified Speech Channel Bot secret key.
        /// </summary>
        /// <param name="secretKey">Speech Channel Bot secret key.</param>
        /// <param name="subscription">Subscription key associated with the bot</param>
        /// <param name="region">The region name (see the <a href="https://aka.ms/csspeech/region">region page</a>).</param>
        /// <returns>A new dialog service config.</returns>
        public static DialogServiceConfig FromBotSecret(string secretKey, string subscription, string region)
        {
            IntPtr configHandle = IntPtr.Zero;
            ThrowIfFail(Internal.DialogServiceConfig.dialog_service_config_from_bot_secret(out configHandle, secretKey, subscription, region));
            return new DialogServiceConfig(configHandle);
        }

        /// <summary>
        /// Creates an instance of the dialog service config with the specified Speech Commands Application id.
        /// </summary>
        /// <param name="applicationId">Speech Commands application id.</param>
        /// <param name="subscription">Subscription key associated with the bot</param>
        /// <param name="region">The region name (see the <a href="https://aka.ms/csspeech/region">region page</a>).</param>
        /// <returns>A new dialog service config.</returns>
        public static DialogServiceConfig FromSpeechCommandsAppId(string applicationId, string subscription, string region)
        {
            IntPtr configHandle = IntPtr.Zero;
            ThrowIfFail(Internal.DialogServiceConfig.dialog_service_config_from_speech_commands_app_id(out configHandle, applicationId, subscription, region));
            return new DialogServiceConfig(configHandle);
        }

        /// <summary>
        /// Identifier used to connect to the backend service.
        /// </summary>
        public string ApplicationId
        {
            get
            {
                return progBag.GetProperty(PropertyId.Conversation_ApplicationId);
            }
            set
            {
                progBag.SetProperty(PropertyId.Conversation_ApplicationId, value);
            }
        }

        /// <summary>
        /// Connection initial silence timeout property.
        /// </summary>
        public string InitialSilenceTimeout
        {
            get
            {
                return progBag.GetProperty(PropertyId.Conversation_Initial_Silence_Timeout);
            }
            set
            {
                progBag.SetProperty(PropertyId.Conversation_Initial_Silence_Timeout, value);
            }
        }

        /// <summary>
        /// The format of the audio that is returned during text to speech.
        /// </summary>
        public string TextToSpeechAudioFormat
        {
            get
            {
                return progBag.GetProperty(PropertyId.SpeechServiceConnection_SynthOutputFormat);
            }
            set
            {
                progBag.SetProperty(PropertyId.SpeechServiceConnection_SynthOutputFormat, value);
            }
        }
    }
}
