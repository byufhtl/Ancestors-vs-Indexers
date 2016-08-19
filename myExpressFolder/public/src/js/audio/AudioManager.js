/**
 * Created by calvin on 8/16/16.
 * This class and it's attendant Playlist class are designed to make musical effects more easily streamable. It currently
 * deals only with songs and is not capable of playing sound effects in parallel. That will be the upgraded version
 * coming up when we come around to needing it. Actually, that might end up being something else...
 */

define(['jquery'],function($){

    function Playlist(manager, name){
        this.name = name;
        this.currentSong = null;
        this.all_songs = [];
        this.remaining_songs = [];
        var self = this;

        /**
         * Adds a song to the playlist.
         *
         * @param song The song being added. Uses presets defined on the AudioManager.
         */
        this.addSong = function(song){
            // song.audio.play();
            song.audio.autoplay = false;
            song.audio.preload = "auto";
            // song.audio.load();
            song.audio.addEventListener('ended',function(e){
                // console.log("<<MUSIC>>\t\"" + song.name + "\"", "has finished playing.");
                manager.pause();
                song.audio.currentTime = 0;
                song.audio.playbackRate = 1;
                manager.audio = null;
                manager.play();
            });
            self.all_songs.push(song);
        };

        this.next = function(){
            if(this.all_songs.length != 0){
                if(this.remaining_songs.length == 0){
                    // console.log("Reloading playlist [" + this.name + "]");
                    this.remaining_songs = this.all_songs.slice(); // Copies a segment, which in this case includes everything.
                    if(this.remaining_songs.length > 2) { // If there are more than two songs, randomize their order in the list.
                        var posA;
                        var posB;
                        var temp;
                        for (var i = 0; i < this.remaining_songs.length; i++) {
                            posA = Math.floor(Math.random() * this.remaining_songs.length);
                            posB = Math.floor(Math.random() * this.remaining_songs.length);

                            temp = this.remaining_songs[posA];
                            this.remaining_songs[posA] = this.remaining_songs[posB];
                            this.remaining_songs[posB] = temp;
                        }
                    }
                }
                if(this.currentSong) { // pause and reset last audio track.
                    manager.pause();
                    this.currentSong.audio.currentTime = 0;
                    this.currentSong.audio.playbackRate = 1;
                }
                this.currentSong = this.remaining_songs.shift();
                return this.currentSong;
            }
            console.log("Attempted to play an empty playlist.", "AudioManager.js - Playlist();");
            return null;
        }
    }

    function AudioManager(){

        this.audio = null; // Audio object

        this.playlists = {};
        this.menuList = new Playlist(this, AudioManager.playlists.MENUS);
        this.gameList = new Playlist(this, AudioManager.playlists.GAMEPLAY);
        this.current_playlist = null;
        this.current_piece = null; // Song and it's information
        this.playbackRate = 1;
        this.lastVolume = .5; // Stores old value for restoration after muting.
        this.volume = .5;
        this.playing = false;

        /**
         * Initializes the audio manager. May cause problems if called in succession, but theoretically just sets
         * everything up.
         * Must perform this before the audio manager will operate correctly.
         */
        this.init = function(){

            this.menuList.addSong(AudioManager.songs.COMMITMENT);
            this.gameList.addSong(AudioManager.songs.ASCENDANCY);
            this.gameList.addSong(AudioManager.songs.JOURNEYMAN);
            this.gameList.addSong(AudioManager.songs.MOUNTAINS);
            // this.gameList.addSong(AudioManager.songs.PSYCHOPATH);
            this.playlists[AudioManager.playlists.MENUS] = this.menuList;
            this.playlists[AudioManager.playlists.GAMEPLAY] = this.gameList;

            this.current_playlist = this.gameList;
            this.current_piece = this.current_playlist.next();
            this.audio = this.current_piece.audio;
            this.playbackRate = 1;
            this.volume = .5;
            this.playing = false;
            this.muted = false;
        };

        /**
         * Plays pre-configured audio (.opus file format)
         * If a song is passed as a parameter, that song will be played.
         * If not, it will default to the current playlist.
         *      If there is nothing currently playing, a song is loaded from the playlist.
         *      Else the currently playing song is resumed.
         *
         * @param song an object containing the song's name and the <code>Audio</code> object associated with it.
         */
        this.play = function(song){
            var self = this;
            if(song){
                if(this.current_piece){
                    this.current_piece.audio.currentTime = 0;
                }
                this.current_piece = song;
                this.audio = song.audio;
            }
            else if(self.current_playlist){
                if(!self.audio){
                    // console.log("Loading Music");
                    self.current_piece = self.current_playlist.next();
                    if(self.current_piece && self.current_piece.audio) {
                        self.audio = self.current_piece.audio;
                        // console.log("Load to Playing:", this.getTrackData());
                        this.setTempo();
                        this.setVolume();
                        this.playing = true;
                        self.audio.play();
                        console.log("<<MUSIC>> Now Playing:", this.getTrackData());
                    }
                }
                else {
                    // console.log("Naturally Playing:", this.getTrackData());
                    this.setTempo();
                    this.setVolume();
                    this.playing = true;
                    self.audio.play();
                    console.log("<<MUSIC>> Now Playing:", this.getTrackData());
                }
            }
        };

        /**
         * Pauses the current media.
         */
        this.pause = function(){
            var self = this;
            if(self.audio){
                this.playing = false;
                self.audio.pause();
            }
        };

        /**
         * Switches the playlist. Playlists are described on the AudioManager class itself.
         *
         * @param nextListName The name of the list being switched to.
         *
         * @param playImmediately Whether or not to play immediately. If not filled, defaults to whether or not the music
         * was playing before the change of playlist.
         */
        this.switchPlaylist = function(nextListName, playImmediately){
            if(this.playlists.hasOwnProperty(nextListName)){
                this.current_playlist = this.playlists[nextListName];
                this.pause();
                this.audio = null;
                if(((playImmediately != null) ? playImmediately : this.playing)) {
                    this.play();
                }
            }
        };

        /**
         * Returns some rudimentary information on a song, including it's name, how long it is, and where the playback is at.
         *
         * If a name is supplied, the information for the song will include only it's name, duration, and music.
         *
         * Otherwise, the current playlist, track, and progress will also be returned.
         *
         * @param name (Optional) the name of the track being studied.
         * @returns {*}
         */
        this.getTrackData = function(name){
            if(name && AudioManager.songs.hasOwnProperty(name)){
                var song = AudioManager.songs[name];
                return {
                    song : song.name,
                    totaltime : song.audio.duration,
                    audiofile: song.audio
                };
            }
            return {
                playlist : this.current_playlist.name,
                song : this.current_piece.name,
                totaltime : this.current_piece.audio.duration,
                currentPlace : this.current_piece.audio.currentTime,
                audiofile: this.current_piece.audio
            };
        };

        /**
         * Sets the current audio tempo. Calling without parameters will cause the current music to be updated to the
         * current tempo without changing the tempo itself.
         *
         * @param tempo (Optional) a digit (0, 2] specifying the playback speed. (1) is standard.
         */
        this.setTempo = function(tempo){
            if(tempo != null && tempo != undefined && tempo > 0) {
                tempo = (tempo > 0) ? tempo : 1;
                tempo = (tempo <= 2) ? tempo : 2;
                (this.playbackRate = tempo);
            }
            if(this.audio){
                this.audio.playbackRate = this.playbackRate;
            }

        };

        /**
         * A quick means of accelerating the audio speed. Accelerates by a factor of 1.25
         * @param x The degree of acceleration: 1.25 * x (Defaults to (1), capped at total speed of (2).)
         */
        this.accelerate = function(x){
            x = (x >= 0) ? x : 1;
            this.setTempo(this.playbackRate * 1.25 * x);
        };

        /**
         * A quick means of slowing the audio speed. Decelerates by a factor of .8
         * @param x The degree of acceleration: .8 * x (Defaults to (1), capped at total speed of (0).)
         */
        this.slow = function(x){
            x = (x >= 0) ? x : 1;
            this.setTempo(this.playbackRate * .8 * x);
        };

        /**
         * Sets the audio volume to an integer between 0 (softest) and 1 (loudest). If no value is supplied, sets the
         * current track's audio to the current level without changing that level.
         *
         * @param volume The desired volume on the range of [0,1]
         */
        this.setVolume = function(volume){
            if(volume != null){
                if(volume <= 1 && volume >= 0){
                    this.volume = volume;
                }
                else{
                    console.log("Invalid Volume control:", volume);
                }
            }
            if(this.audio){
                this.audio.volume = this.volume;
            }
        };

        /**
         * Mutes/Unmutes the audio
         *
         * Mute: pauses audio and then sets the volume to 0 (to save processor on music that isn't being played, please
         * pause the audio before muting the volume).
         *
         * Unmute: Restores the volume to the last known level.
         *
         * @param on Whether or not mute is being turned on or off.
         */
        this.mute = function(on){
            if(on && !this.muted){
                this.lastVolume = this.volume;
                this.setVolume(0);
                this.muted = true;
            }
            else if(this.muted){
                this.setVolume(this.lastVolume);
                this.muted = false;
            }
        };
    }

    /**
     * The list of all songs.
     * @type {{JOURNEYMAN: {name: string, audio: Audio}, MOUNTAINS: {name: string, audio: Audio}, COMMITMENT: {name: string, audio: Audio}}}
     */
    AudioManager.songs = {

        // GAMEPLAY
        JOURNEYMAN:         {name: "journeyman", audio: new Audio("src/audio/journeyman.opus")},
        MOUNTAINS:          {name: "mountains",  audio: new Audio("src/audio/mountains.opus")},
        // PSYCHOPATH:         {name: "psychopath", audio: new Audio("src/audio/weird.opus")},
        ASCENDANCY:         {name: "ascendancy", audio: new Audio("src/audio/ascend.opus")},

        // MENU MANAGEMENT
        COMMITMENT:         {name: "commitment", audio: new Audio("src/audio/commitment.opus")}
    };

    /**
     * The list of playlists.
     * @type {{GAMEPLAY: string, MENUS: string}}
     */
    AudioManager.playlists = {
        GAMEPLAY: "Gameplay",
        MENUS: "Menus"
    };

    return AudioManager;

});