Template.story.events({

  /**
     * @summary Actualiza la colleccion stories con un me gusta en una historia
     * @isMethod true
     * @locus Template.story.events
     * @param  {Object} el evento necesita el evento para actualizarse
     */

    'click .like':function(e) {
        e.preventDefault();
        var story = Blaze.getData(e.currentTarget);
        var liker = Meteor.user();
        var likeData = {name: liker.profile.name.first + " " + liker.profile.name.last};
        var alreadyLiked = _.findWhere(story.likes, likeData);
        if(!alreadyLiked){
            Stories.update({_id: story._id}, {$push:{likes: likeData}});
        } else {
            Stories.update({_id: story._id}, {$pull:{likes:likeData}});
        }
    },

    /**
       * @summary borra una story
       * @isMethod true
       * @locus Template.story.events
       * @param  {Object} Se neceseita el evento para borrarlo
       */
    'click .delete-story':function(e){
      e.preventDefault();
      var story = Blaze.getData(e.currentTarget);
      //console.log(story);
      Stories.remove(story._id);
    },

    /**
       * @summary Evento de enviar. Añade un comentario en una story
       * @isMethod true
       * @locus Template.story.events
       * @param  {Object} Se necesita evento para añadir
       */
    'submit .comment-story':function(event){
      event.preventDefault();

      const target = event.target;
      const commentText = target.text.value;

      var story = Blaze.getData(event.currentTarget);

      
      if (commentText){
        
        var userOwner = Meteor.user();
        console.log(userOwner);
        Stories.update({_id: story._id}, {$push:{comments: {
                                                   commentText: commentText,
                                                   commentDate: new Date(),
                                                   owner: Meteor.userId(),
                                                   idStory : story._id,
                                                   userImageComment : userOwner.profile.picture.thumbnail,
                                                   creatorNameComment : userOwner.profile.name.first,
                                                   username : userOwner.profile.login.username


                                                }}});
        
        Stories.update({_id: story._id},{$push:{comments:{$each:[],$sort: {"commentDate": -1}} }},{'multi':true});

      }
      target.text.value = '';

    }


})



Template.story.helpers({

    status:function(){
        return this.createdFor === this.createdBy;
    },

    /**
       * @summary Compara el propietario con el usuario conectado
       * @isMethod true
       * @locus Template.story.helpers
       */
    ownerStory:function(){
        return this.createdBy === Meteor.userId();
    },

    /**
       * @summary Devuelve True or False si el usuario a puesto like o no
       * @isMethod true
       * @locus Template.story.helpers
       */
    styleLike:function(){

      var liker = Meteor.user();
      var likeData = {name: liker.profile.name.first + " " + liker.profile.name.last};
      var alreadyLiked = _.findWhere(this.likes, likeData);
      if (! alreadyLiked) {
        return false;
      } else {
        return true;
      }
    },

    /**
       * @summary Function to refactor the date of the story
       * @isMethod true
       * @locus Template.story.helpers
       * @param  {Date} date necesita la fecha de la story para cambiarla y mostrarla
       */
    datestory:function(date) {
      return moment(date).format('MM-DD-YYYY HH:mm');
    },

    /**
       * @summary Devuelve cuantos likes tiene esta story
       * @isMethod true
       * @locus Template.story.helpers
       * @param  {Integer} storyId que es la id de la story
       */
    likeCount:function(storyId){
        var story = Stories.findOne({_id: storyId});
        var likes = story.likes;
        if(!likes.length) {
            return "Nobody has liked this post yet.";
        } else if(likes.length <= 3) {
            var string = "";
            switch (likes.length) {
                case 1:
                    return likes[0].name + " likes this";
                    break;
                case 2:
                    return likes[0].name + " and " + likes[1].name + " like this";
                    break;
                case 3:
                    return likes[0].name + ", " + likes[1].name + " and " + likes[2].name + " like this";
                break;
            }

        } else {
            var correctLength = likes.length - 3;
            var correctOther;
            if(correctLength === 1) {
                correctOther = " other person likes this";
            } else {
                correctOther = " other people like this";
            }
            return likes[0].name + ", " + likes[1].name + ", " + likes[2].name + " and " + correctLength + correctOther;
        }

    }

})



Template.commentTemaplte.events({
  /**
     * @summary Borra un comentario de la story
     * @isMethod true
     * @locus Template.commentTemaplte.events
     * @param  {Object} e necesita un evento para borrarlo
     */
  'click .delete-comment':function(e){
    e.preventDefault();
    var comment = Blaze.getData(e.currentTarget);
    console.log("hola");
    Stories.update({_id: comment.idStory}, {$pull: { comments: {
                                                      commentText: comment.commentText ,
                                                      commentDate: comment.commentDate,
                                                      owner: comment.owner,
                                                      idStory: comment.idStory,
                                                      userImageComment: comment.userImageComment,
                                                      creatorNameComment: comment.creatorNameComment,



                                                    }}});
  }
})



//Es necesario el paquete meteor add momentjs:moment
Template.commentTemaplte.helpers({
  /**
     * @summary Funcion para rectificar la fecha del comentario
     * @isMethod true
     * @locus Template.commentTemaplte.helpers
     * @param  {Date} date necesita la fecha del comentario para rectificarla y mostrarla
     */
  dateRefactor:function(date){

    return moment(date).format('MM-DD-YYYY HH:mm');
  },
  /**
     * @summary Si el comentario es del usuario conectado devuelve true
     * @isMethod true
     * @locus Template.commentTemaplte.helpers
     */
  ownerComment:function(){
      return this.owner === Meteor.userId();
  }
})