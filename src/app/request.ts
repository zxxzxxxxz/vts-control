interface RequestBase {
    apiName: "VTubeStudioPublicAPI";
    apiVersion: "1.0";
    requestID: string;
    messageType: string;
};

interface APIStateRequest extends RequestBase {
    messageType: "APIStateRequest";
};

// API Server Discovery (UDP)
interface VTubeStudioAPIStateBroadcast extends RequestBase {
    messageType: "VTubeStudioAPIStateBroadcast",
    data: {
        active: boolean,
        port: number,
        instanceID: string,
        windowTitle: string
    }
};

// Authentication Request
interface AuthenticationTokenRequest extends RequestBase {
    messageType: "AuthenticationTokenRequest",
    data: {
        pluginName: string,
        pluginDeveloper: string,
        pluginIcon: string
    }
};

interface AuthenticationRequest extends RequestBase {
    messageType: "AuthenticationRequest",
    data: {
        pluginName: string,
        pluginDeveloper: string,
        authenticationToken: string
    }
};

interface StatisticsRequest extends RequestBase {
    messageType: "StatisticsRequest"
};

// Getting list of VTS folders
interface VTSFolderInfoRequest extends RequestBase {
    messageType: "VTSFolderInfoRequest"
};

// Getting the currently loaded model
interface CurrentModelRequest extends RequestBase {
    messageType: "CurrentModelRequest"
};

// Getting a list of available VTS models
interface AvailableModelsRequest extends RequestBase {
    messageType: "AvailableModelsRequest"
};

// Loading a VTS model by its ID
interface ModelLoadRequest extends RequestBase {
    messageType: "ModelLoadRequest",
    data: {
        modelID: string
    }
};

// Moving the currently loaded VTS model
interface MoveModelRequest extends RequestBase {
    messageType: "MoveModelRequest",
    data: {
        timeInSeconds: number,
        valuesAreRelativeToModel: boolean,
        positionX: number,
        positionY: number,
        rotation: number,
        size: number
    }
};

// Requesting list of hotkeys available in current or other VTS model
interface HotkeysInCurrentModelRequest extends RequestBase {
    messageType: "HotkeysInCurrentModelRequest",
    data: {
        modelID: string,
        live2DItemFileName: string
    }
};

// Requesting execution of hotkeys
interface HotkeyTriggerRequest extends RequestBase {
    messageType: "HotkeyTriggerRequest";
    data: {
        hotkeyID: string,
        itemInstanceID: string
    };
};

// Requesting current expression state list
interface ExpressionStateRequest extends RequestBase {
    messageType: "ExpressionStateRequest";
    data: {
        details: boolean,
        expressionFile: string,
    };
};

// Requesting activation or deactivation of expressions
interface ExpressionActivationRequest extends RequestBase {
    messageType: "ExpressionActivationRequest";
    data: {
        expressionFile: string,
        active: boolean
    };
};

// Requesting list of ArtMeshes in current model
interface ArtMeshListRequest extends RequestBase {
    messageType: "ArtMeshListRequest";
};

// Tint ArtMeshes with color
interface ColorTintRequest extends RequestBase {
    messageType: "ColorTintRequest";
    data: {
        colorTint: {
            colorR: number,
            colorG: number,
            colorB: number,
            colorA: number,
            mixWithSceneLightingColor: number
        },
        artMeshMatcher: {
            tintAll: boolean,
            artMeshNumber: number[],
            nameExact: string[],
            nameContains: string[],
            tagExact: any[],
            tagContains: string[]
        }
    };
};

// Getting scene lighting overlay color
interface SceneColorOverlayInfoRequest extends RequestBase {
    messageType: "SceneColorOverlayInfoRequest";
};

// Checking if face is currently found by tracker
interface FaceFoundRequest extends RequestBase {
    messageType: "FaceFoundRequest";
};

export type Request = APIStateRequest
    | VTubeStudioAPIStateBroadcast
    | AuthenticationTokenRequest
    | AuthenticationRequest
    | StatisticsRequest
    | VTSFolderInfoRequest
    | CurrentModelRequest
    | AvailableModelsRequest
    | ModelLoadRequest
    | MoveModelRequest
    | HotkeysInCurrentModelRequest
    | HotkeyTriggerRequest
    | ExpressionStateRequest
    | ExpressionActivationRequest
    | ArtMeshListRequest
    | ColorTintRequest
    | SceneColorOverlayInfoRequest
    | FaceFoundRequest;