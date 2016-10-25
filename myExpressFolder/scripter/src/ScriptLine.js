/**
 * Created by calvinm2 on 10/6/16.
 */

define([],function(){

    /**
     * ScriptLine node.
     * @param id The script __next_id this line is associated with.
     * @param tag The line tag
     * @param speaker the speaker's name
     * @param message the message
     * @param event the event that accompanies this script
     * @constructor
     */
    function ScriptLine(id, tag, speaker, message, event = ""){
        this.__scriptId = id;
        this.__lineTag = tag;
        this.__speaker = speaker;
        this.__message = message;
        this.__event = event;
    }

    ScriptLine.prototype = {
        setScriptid:function(id){this.__scriptId = id;},
        getScriptId:function(){return this.__scriptId;},
        setLineTag:function(tag){this.__lineTag = tag;},
        getLineTag:function(){return this.__lineTag;},
        setSpeaker:function(spr){this.__speaker = spr;},
        getSpeaker:function(){return this.__speaker;},
        setMessage:function(mes){this.__message = mes;},
        getMessage:function(){return this.__message;},
        setEvent:function(event){this.__event = event;},
        getEvent:function(){return this.__event;}
    };

    return ScriptLine;

});