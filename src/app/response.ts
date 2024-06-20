interface ResponseBase {
    apiName: "VTubeStudioPublicAPI";
    apiVersion: "1.0";
    timestamp: number;
    messageType: string;
    requestID: string;
};

interface APIStateResponse extends ResponseBase {
    messageType: "APIStateRequest"
};

interface AuthenticationTokenResponse extends ResponseBase {
    messageType: "AuthenticationTokenResponse";
    data: {
        authenticationToken: string;
        errorID?: void;
        message?: void;
    } | {
        authenticationToken?: void;
        errorID: number;
        message: string;
    };
};

interface AuthenticationResponse extends ResponseBase {
    messageType: "AuthenticationResponse";
    data: {
        authenticated: boolean,
        reason: string
    };
};


interface StatisticsResponse extends ResponseBase {
    messageType: "StatisticsResponse",
    data: {
        uptime: number,
        framerate: number,
        vTubeStudioVersion: string,
        allowedPlugins: number,
        connectedPlugins: number,
        startedWithSteam: boolean,
        windowWidth: number,
        windowHeight: number,
        windowIsFullscreen: boolean
    }
};


// Getting list of VTS folders
interface VTSFolderInfoResponse extends ResponseBase {
    messageType: "VTSFolderInfoResponse",
    data: {
        models: string,
        backgrounds: string,
        items: string,
        config: string,
        logs: string,
        backup: string
    }
};


// Getting the currently loaded model
interface CurrentModelResponse extends ResponseBase {
    messageType: "CurrentModelResponse",
    data: {
        modelLoaded: boolean,
        modelName: string,
        modelID: string,
        vtsModelName: string,
        vtsModelIconName: string,
        live2DModelName: string,
        modelLoadTime: number,
        timeSinceModelLoaded: number,
        numberOfLive2DParameters: number,
        numberOfLive2DArtmeshes: number,
        hasPhysicsFile: boolean,
        numberOfTextures: number,
        textureResolution: number,
        modelPosition: {
            positionX: number,
            positionY: number,
            rotation: number,
            size: number
        }
    }
};


// Getting a list of available VTS models
interface AvailableModelsResponse extends ResponseBase {
    messageType: "AvailableModelsResponse",
    data: {
        numberOfModels: number,
        availableModels: {
            modelLoaded: boolean,
            modelName: string,
            modelID: string,
            vtsModelName: string,
            vtsModelIconName: string
        }[]
    }
};

// Loading a VTS model by its ID
interface ModelLoadResponse extends ResponseBase {
    messageType: "ModelLoadResponse",
    data: {
        modelID: "UniqueIDOfModelThatWasJustLoaded"
    }
};

// Moving the currently loaded VTS model
interface MoveModelResponse extends ResponseBase {
    messageType: "MoveModelResponse",
    data: {}
};

// Requesting list of hotkeys available in current or other VTS model
interface HotkeysInCurrentModelResponse extends ResponseBase {
    messageType: "HotkeysInCurrentModelResponse",
    data: {
        modelLoaded: boolean,
        modelName: string,
        modelID: string,
        availableHotkeys: {
            name: string,
            type: string,
            description: string,
            file: string,
            hotkeyID: string,
            keyCombination: any[],
            onScreenButtonID: number
        }[]
    }
};

// Requesting execution of hotkeys
interface HotkeyTriggerResponse extends ResponseBase {
    messageType: "HotkeyTriggerResponse",
    data: {
        hotkeyID: string
    }
};

// Requesting current expression state list
interface ExpressionStateResponse extends ResponseBase {

    messageType: "ExpressionStateResponse",
    data: {
        modelLoaded: boolean,
        modelName: string,
        modelID: string,
        expressions: {
            name: string,
            file: string,
            active: boolean,
            deactivateWhenKeyIsLetGo: boolean,
            autoDeactivateAfterSeconds: boolean,
            secondsRemaining: number,
            usedInHotkeys: {
                name: string,
                id: string
            }[],
            parameters: {
                name: string,
                value: number
            }[]
        }[]
    }
};

// Requesting activation or deactivation of expressions
interface ExpressionActivationResponse extends ResponseBase {

    messageType: "ExpressionActivationResponse",
    data: {}
};

// Requesting list of ArtMeshes in current model
interface ArtMeshListResponse extends ResponseBase {

    messageType: "ArtMeshListResponse",
    data: {
        modelLoaded: boolean,
        numberOfArtMeshNames: number,
        numberOfArtMeshTags: number,
        artMeshNames: string[],
        artMeshTags: string[]
    }
};

// Tint ArtMeshes with color
interface ColorTintResponse extends ResponseBase {

    messageType: "ColorTintResponse",
    data: {
        matchedArtMeshes: number
    }
};

// Getting scene lighting overlay color
interface SceneColorOverlayInfoResponse extends ResponseBase {
    messageType: "SceneColorOverlayInfoResponse",
    data: {
        active: boolean,
        itemsIncluded: boolean,
        isWindowCapture: boolean,
        baseBrightness: number,
        colorBoost: number,
        smoothing: number,
        colorOverlayR: number,
        colorOverlayG: number,
        colorOverlayB: number,
        colorAvgR: number,
        colorAvgG: number,
        colorAvgB: number,
        leftCapturePart: {
            active: boolean,
            colorR: number,
            colorG: number,
            colorB: number
        },
        middleCapturePart: {
            active: boolean,
            colorR: number,
            colorG: number,
            colorB: number
        },
        rightCapturePart: {
            active: boolean,
            colorR: number,
            colorG: number,
            colorB: number
        }
    }
};

interface FaceFoundResponse extends ResponseBase {
    apiName: "VTubeStudioPublicAPI",
    messageType: "FaceFoundResponse",
    data: {
        found: boolean
    }
};

export type Response = APIStateResponse
    | AuthenticationTokenResponse
    | AuthenticationResponse
    | StatisticsResponse
    | VTSFolderInfoResponse
    | CurrentModelResponse
    | AvailableModelsResponse
    | ModelLoadResponse
    | MoveModelResponse
    | HotkeysInCurrentModelResponse
    | HotkeyTriggerResponse
    | ExpressionStateResponse
    | ExpressionActivationResponse
    | ArtMeshListResponse
    | ColorTintResponse
    | SceneColorOverlayInfoResponse
    | FaceFoundResponse;