/**
 * Created by calvinm2 on 10/6/16.
 */

define(["ScriptLine"],function(ScriptLine){


    class SNode{
        constructor(scrl, id){
            this.data = scrl;
            this.id = id;
        }

        getData(index = null){
            if(index){
                this.data.setLineTag(index);
            }
            return this.data;
        }

        setId(id){
            this.id = id;
        }

        getId(){
            return this.id;
        }
    }



    class Script{
        constructor(id){
            this.name = id;
            this.size = 0;
            this.arr = [];
            this.__next_id = 0;
        }

        load(scr){
            this.name = scr.name;
            this.size = scr.size;
            this.arr = [];
            for(var val of scr.arr){
                console.log("Val:", val);
                val.data.__proto__ = ScriptLine.prototype;
                this.arr.push(new SNode(val.data, val.id));
            }
            console.log("Copy arr:",this.arr);
            this.__next_id = scr.__next_id;
        }

        insertHead(scrl){
            // console.log("Inserting", scrl, "at head of", this.arr);
            this.arr.unshift(new SNode(scrl, this.__next_id++));
            // console.log("InsertHead Result:", this.arr);
        }

        insertTail(scrl){
            // console.log("Inserting", scrl, "at tail of", this.arr);
            this.arr.push(new SNode(scrl, this.__next_id++));
            // console.log("InsertTail Result:", this.arr);
        }

        insertAfter(scrl, id){
            // console.log("Insert After");
            for(var i = 0; i < this.arr.length; i++){
                if(this.arr[i].getId() == id){
                    // console.log("Inserting", scrl, "after", this.arr[i], "in", this.arr);
                    if(i + 1 == this.arr.length){
                        this.insertTail(scrl);
                    }
                    else {
                        this.arr.splice(i+1, 0, new SNode(scrl, this.__next_id++));
                    }
                    // console.log("InsertAfter Result:", this.arr);
                    return;
                }
            }
            // console.log("Post-insertion failed: no target found.")
        }

        insertBefore(scrl, id){
            // console.log("Insert After");
            for(var i = 0; i < this.arr.length; i++){
                if(this.arr[i].getId() == id){
                    // console.log("Inserting", scrl, "after", this.arr[i], "in", this.arr);
                    if(i == 0){
                        this.insertHead(scrl);
                    }
                    else {
                        this.arr.splice(i, 0, new SNode(scrl, this.__next_id++));
                    }
                    // console.log("InsertAfter Result:", this.arr);
                    return;
                }
            }
            // console.log("Pre-insertion failed: no target found.")
        }

        /**
         * Removes the first item in the script that matches the given id.
         * @param id The id of the node to remove.
         */
        remove(id){
            // console.log("Removal");
            for(var i = 0; i < this.arr.length; i++){
                if(this.arr[i].getId() == id){
                    // console.log("Removing id", id, "from", this.arr);
                    this.arr.splice(i, 1);
                    // console.log("Remove Result:", this.arr);
                    return;
                }
            }
            // console.log("Removal failed: no target found.")
        }

        dispenseId(){
            return this.__next_id;
        }

        /**
         * Gets the data node with the matching __next_id.
         * @param id The __next_id to to seek
         * @returns {*} A Scriptline object, or null if nothing with the given ID exists in the script
         */
        getById(id){
            for(var i = 0; i < this.arr.length; i++){
                if(this.arr[i].getId() == id){
                    // console.log("Getting id", id, "from", this.arr);
                    var datum = this.arr[i].getData();
                    // console.log("Getting Result:", datum);
                    return datum;
                }
            }
            return null
        }

        buildForEach(f){
            // console.log("Building...");
            for(var i = 0; i < this.arr.length; i++){
                var node = this.arr[i];
                f(node.getId(), node.getData());
            }
        }
    }

    return Script;
});