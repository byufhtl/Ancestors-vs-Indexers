/**
 * Created by calvinm2 on 10/6/16.
 */

define(["ScriptLine"],function(ScriptLine){


    class SNode{
        constructor(scrl, id, prev = null, next = null){
            this.__data = scrl;
            this.__id = id;
            this.__prev = prev;
            this.__next = next;
        }

        setPrev(prev){
            console.log("PREV SET <", this, ">:",prev);
            this.__prev = prev;
        }

        setNext(next){
            console.log("NEXT SET <", this, ">:", next);
            this.__next = next;
        }

        getData(index = null){
            if(index){
                this.data.setLineTag(index);
            }
            return this.__data;
        }

        getPrev(){
            return this.__prev;
        }

        getNext(){
            return this.__next;
        }

        getId(){
            return this.__id;
        }
    }



    class Script{
        constructor(id, lines = []){
            this.name = id;
            this.size = 0;
            this.head = null;
            this.__next_id = 0;
            this.__buildList(Script.__sortStartToFinish(lines));
        }

        static __sortStartToFinish(lines){
            lines.sort(function(a,b){
                if(a.getLineTag() > b.getLineTag()){
                    return -1;
                }
                return 1;
            });
            return lines;
        }

        __buildList(lines){
            var last = null;
            for(var i = 0; i < lines.length; i++){
                var curr = new SNode(this.lines[i], this.__next_id++, last);
                if(this.head == null){this.head = curr;}
                else if(last){ last.setNext(curr); }
                last = curr;
                ++this.size;
            }
        }

        insertHead(scrl){
            console.log("Head value at insertion:", this.head);
            var snode = new SNode(scrl, this.__next_id++, null, this.head);
            console.log("Head value at pre-i:",this.head);
            console.log("SNODE:", snode);
            if(this.head) {
                this.head.setPrev(snode);
            }
            this.head = snode;
            console.log("Investigating head:",this.head);
        }

        insertTail(scrl){
            var snode = new SNode(scrl, this.__next_id++, null);
            var ptr = this.head;
            while(ptr.getNext() != null){ ptr = ptr.getNext(); }
            ptr.setNext(snode);
            snode.setPrev(ptr);
        }

        insertAfter(scrl, id){
            var ptr = this.head;
            console.log("Derp",ptr);
            while(ptr){
                console.log(ptr.getId(),id);
                if(ptr.getId() == id){
                    console.log("Found:", ptr);
                    var snode = new SNode(scrl, this.__next_id++, ptr, ptr.getNext());
                    ptr.setNext(snode);
                    if (ptr.getNext()) {
                        ptr.getNext().setPrev(snode);
                    }
                    console.log("Post-inserted:",snode, id);
                    return; // Found it.
                }
                ptr = ptr.getNext();
            }
        }

        insertBefore(scrl, id){
            console.log("<SCT>Pre-insertion", id);
            var ptr = this.head;
            while(ptr){
                if(ptr.getId() == id){
                    console.log("<SCT> Found insertion point:", ptr);
                    var snode = new SNode(scrl, this.__next_id++, null);
                    if(ptr == this.head){
                        this.head = snode;
                    }
                    else{
                        snode.setPrev(ptr.getPrev());
                        if(snode.getPrev()){snode.getPrev().setNext(snode);}
                    }
                    snode.setNext(ptr);
                    ptr.setPrev(snode);
                    return;
                }
                ptr = ptr.getNext();
            }
        }

        /**
         * Removes the first item in the script that matches the given id.
         * @param id The id of the node to remove.
         */
        remove(id){
            var ptr = this.head;
            while(ptr){
                if(ptr.getId() == id){
                    var prev = ptr.getPrev();
                    var next = ptr.getNext();
                    if(prev){ prev.setNext(next); }
                    if(next){ next.setPrev(prev); }
                    return;
                }
                ptr = ptr.getNext();
            }
        }

        serialize(){
            var ptr = this.head;
            var out = '{\"script\":[';
            var num = 0;
            while(ptr != null){
                out += JSON.stringify(ptr.getData(num++)) + (ptr.getNext() ? "," : "");
                ptr = ptr.getNext();
            }
            out += ']}';
            return out;
        }

        *iter(){
            console.log("Iterating");
            var start = this.head;
            while(start){
                var now = start;
                start = start.getNext();
                yield now;
            }
            yield null;
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
            console.log("Getting by id.");
            var ptr = this.head;
            while(ptr){
                // console.log("Seeking:",ptr.getId(),id);
                if(ptr.getId() == id){
                    console.log("ID1:",this.head);
                    return ptr.getData();
                }
                ptr = ptr.getNext();
            }
            console.log("ID2:",this.head);
            return null;
        }

        getHead(){
            console.log("Getting Head:",this.head);
            return this.head;
        }
    }

    return Script;
});