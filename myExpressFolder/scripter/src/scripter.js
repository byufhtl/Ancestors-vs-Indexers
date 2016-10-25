
define(['jquery','Script','ScriptLine'],function($, Script, ScriptLine){

    class Scripter{
        constructor(id, name = "unnamed", lines = []){
            this.__next_id = id;
            this.__color = 0;
            this.gamescript = new Script(name, lines);
            this.__mode = "speaker";
            this.__characters = {};
        }

        init(){
            console.log("Initing");
            var self = this;

            $('#modal-close').click(function(){
                $('#newModal').modal('hide');
            });
            $('#modal-start').click(function(){
                console.log("Starting...");
                var author = $('#modal-author').val();
                var scriptName = $('#modal-scr-name').val();
                console.log(author, scriptName);
                var warning = $('#modal-warning');
                if(!author || author == ""){
                    warning.val("Please insert a valid author.");
                }
                else if(!scriptName || scriptName == ""){
                    warning.val("Please insert a valid script name.");
                }
                else{
                    $('#author-field').val(author);
                    $('#script-name-field').val(scriptName);
                    self.startNew();
                    $('#newModal').modal('hide');
                }
            });
            $('#menu-new-script').click(function(ev){
                $('#modal-author').val("");
                $('#modal-scr-name').val("");
                $('#newModal').modal('show');
            });

            $('#menu-save-script').click(function(ev){

                var output = {
                    Author:$('#author-field').val(),
                    ScriptName:$('#script-name-field').val(),
                    LastEdited:(new Date()).toString(),
                    Script:self.gamescript
                };

                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(output)));
                element.setAttribute('download', $('#script-name-field').val() + ".scr");

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            });

            $('#menu-load-script').on('change',function(evt) {
                console.log("Loading up.");
                var files = evt.target.files; // FileList object
                // files is a FileList of File objects. List some properties.
                var output = [];
                var out = "";
                for (var i = 0, f; f = files[i]; i++) {
                    console.log("Reading:",f);
                    var reader = new FileReader();
                    reader.onload = function(e){
                        out = e.target.result;
                        console.log("File:",out);
                        var obj = self.parseInputFileRead(out);
                        self.gamescript = new Script(0);
                        self.gamescript.load(obj.Script);
                        $('#author-field').val(obj.Author);
                        $('#script-name-field').val(obj.ScriptName);
                        self.redraw();
                    };
                    reader.readAsText(f);
                    // output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                    //     f.size, ' bytes, last modified: ',
                    //     f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                    //     '</li>');
                }
                // document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
            });
        }

        parseInputFileRead(input){
            return JSON.parse(input);
        }

        startNew(id = 0, name = "unnamed", lines = []){
            console.log("Creating new space");
            this.__next_id = id;
            this.gamescript = new Script(name, lines);
            this.gamescript.insertHead(new ScriptLine(this.gamescript.dispenseId(), 0, "","",""));
            // console.log("Post InsertHead:", this.gamescript);
            this.redraw();
        }

        prependToCurrentScript(id){
            // console.log("PRE-prepend:",this.gamescript);
            this.gamescript.insertBefore(new ScriptLine(this.gamescript.dispenseId(), 0, "","",""), id);
            // console.log("POST-prepend:",this.gamescript);
            this.redraw();
        }

        appendToCurrentScript(id){
            this.gamescript.insertAfter(new ScriptLine(this.gamescript.dispenseId(), 0, "","",""), id);
            this.redraw();
        }

        removeFromCurrentScript(id){
            this.gamescript.remove(id);
            this.redraw();
        }

        redraw(){
            this.__color = 0x55acee;
            // console.log("Updating");
            $('#script-zone').empty();
            this.gamescript.buildForEach(this.buildBox.bind(this));
            // console.log("Post-draw:", this.gamescript);
        }

        buildBox(id, data){
            var self = this;
            // console.log("BUILDING:",data);
            $('#script-zone').append('<div class="scriptBlock" id="'+id+'">' +
                '<div class="col-xs-2" align="left">' +
                '<label for="spk-' + id + '"><h4 class="white-text"><b>Speaker:</b></h4></label>' +
                '</div>' +
                '<div class="col-xs-9" align="left">' +
                '<h4><input type="text" id="spk-' + id + '" value="'+ data.getSpeaker() + '"></h4>' +
                '</div>' +
                '<div class="col-xs-1" align="left">' +
                '<h4><span class="white-text">ID: ' + id + '</span></h4>' +
                '</div>' +
                '<div class="col-xs-12">' +
                '<p class="white-text"><b>Message:</b></p>' +
                '</div>' +
                '<div class="col-xs-12">' +
                '<textarea rows="3" cols="100" id="msg-' + id + '">' + data.getMessage() + '</textarea>' +
                '</div>' +
                '<div class="col-xs-12">' +
                '<p class="white-text"><b>Event:</b></p>' +
                '</div>' +
                '<div class="col-xs-12">' +
                '<textarea rows="3" cols="100" id="evt-' + id + '">' + data.getEvent() + '</textarea>' +
                '</div>' +
                '</div>');

            // Speaker Input Handling.
            var speaker_input = $('#spk-' + id);
            function updateSpeaker(ev){
                var node = self.gamescript.getById(id);
                if(node){
                    // console.log(node, speaker_input.val());
                    node.setSpeaker(speaker_input.val());
                }
                else{
                    console.log("BadID =",id, self.gamescript);
                }
            }
            speaker_input.on('input',updateSpeaker);
            speaker_input.keyup(updateSpeaker);
            speaker_input.change(updateSpeaker);

            // Message Box Handling.
            var message_input = $('#msg-' + id);
            function updateMessage(ev){
                var node = self.gamescript.getById(id);
                if(node){
                    // console.log(node, message_input.val());
                    node.setMessage(message_input.val());
                }
                else{
                    console.log("BadID =",id, self.gamescript);
                }
            }
            message_input.on('input',updateMessage);
            message_input.keyup(updateMessage);
            message_input.change(updateMessage);

            // Event Box Handling

            var event_input = $('#evt-' + id);

            function updateEvent(ev){
                var node = self.gamescript.getById(id);
                if(node){
                    // console.log(node, message_input.val());
                    node.setEvent(event_input.val());
                }
                else{
                    console.log("BadID =",id, self.gamescript);
                }
            }
            event_input.on('input',updateEvent);
            event_input.keyup(updateEvent);
            event_input.change(updateEvent);

            var block = $('#'+id);

            // Prev Button.
            var prev_button = $('<button class="btn btn-info marge2" id="btn-'+id+'">ADD PREVIOUS</button>');
            prev_button.click(function(ev){
                // console.log("Prepending to",id);
                self.prependToCurrentScript(id);
            });
            block.append(prev_button);

            // Next Button.
            var next_button = $('<button class="btn btn-info marge2" id="btn-'+id+'">ADD NEXT</button>');
            next_button.click(function(ev){
                self.appendToCurrentScript(id);
            });
            block.append(next_button);

            // Removal Button.
            var remove_button = $('<button class="btn btn-danger marge2" id="rem-'+id+'">DELETE</button>');
            remove_button.click(function(ev){
                self.removeFromCurrentScript(id);
            });
            block.append(remove_button);

            block.css('background-color', self.getColor(data.getSpeaker()));
        }

        colNorm(){
            return "#55acee";
        }

        colProgressive(){
            function str16(hex){
                if(hex <= 0xf){
                    return "0" + hex.toString(16);
                }
                return hex.toString(16);
            }

            var val = this.__color;
            var b = (0xff & val);
            if((b) > 0x08){
                b -= 0x08;
            }
            else{
                b = 0x00;
            }

            val = val >>> 8;

            var g = (0xff & val);
            if(g > 0x0f){
                g -= 0x0f;
            }
            else{
                g = 0x00;
            }

            val = val >>> 8;

            var r = (0xff & val);
            if(r > 0x02){
                r -= 0x04;
            }
            else{
                r = 0x00;
            }
            this.__color = parseInt(str16(r) + str16(g) + str16(b),16);
            return "#" + str16(r) + str16(g) + str16(b);
        }

        getColor(speaker = null){

            switch(this.__mode){
                case "progressive":
                    return this.colProgressive();
                case "speaker":
                    if(speaker){
                        if(!this.__characters.hasOwnProperty(speaker)){
                            var val = 0;
                            for(var i = 0; i < speaker.length; i++){
                                val += speaker.charCodeAt(i) * i;
                            }
                            this.__characters[speaker] = "#" + (val % 16777215);
                        }
                        return this.__characters[speaker];
                    }
            }
            return this.colNorm();
        }
    }

    return Scripter;

});
