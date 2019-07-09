$(document).ready(function () {
    //pagination
    var current_page = 0;
    var items_per_page = 30;

    //no more
    $("#more").hide();

    //core method
    function getItems(url) {
        return new Promise(function(resolve, reject) {
          $.ajax({
            url: url,
            dataType: 'json'
          }).done((res)=>{
              resolve(res)
          }).fail((res)=>{
             reject(res);
          });
        });
    }

    //attach handlers
    $("#more").on('click', function(e){
        e.preventDefault();
        current_page++;
        getHackerNews();
    });

    $(document).on('click',".hide", function(e){
        e.preventDefault();
        $(this).parent().parent().hide();
    });

    //get comments handler
    $(document).on('click',".comments", function(e){
        var elm = $(this);
        var parent = $(this).parent().parent();
        var kids = parent.find(".comments-wrap").data(kids).kids;
        var story_id = parent.attr('id');

        //if no comments retun
        if (!kids) return;

        //comments already added
        if ( elm.hasClass('comments-added') ) {
            $( '#'+story_id+' .comments-wrap').toggle();
        }
        //add comments
        kids.split(',').forEach(function (index) {
          let url = "https://hacker-news.firebaseio.com/v0/item/"+index+".json?print=pretty";

            console.log(index);
            var html = '';
            getItems(url).then((comment)=>{
                  let html = '<li>'+comment.text+' by '+comment.by+ '</li>';
                  return html;
            }).then((html)=>{
                $( '#'+story_id+' .comments-wrap').append(html);
                elm.addClass('comments-added');
            });
        });
    });
    function getHackerNews() {
      $("#loading").addClass('loading');
      var url = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
      getItems(url).then((items)=>{
        $("#more").show();
        let result_set = items.splice(current_page*items_per_page,items_per_page);
        if (!result_set) { //Maybe display some message
          $("#more").hide();
          return;
        }
        //load news by id
        result_set.forEach(function (index) {
            let url = "https://hacker-news.firebaseio.com/v0/item/"+index+".json?print=pretty";
            getItems(url).then((story)=>{
              if (story) {
                  let item =  "<li id='story-"+story.id+"'>"+
                                "<h3><a href='"+story.url+"' target='_blank'>"+story.title+"</a> <span class='by'>(" +story.by+ ")</span></h3>"+
                                "<p>" +story.score+ " points by " +story.by+ "<time datetime='"+new Date(parseInt(story.time*1000)).toISOString()+"'></time> | <span class='hide'>hide</span> | <span class='comments'>" + (story.kids.length || 'No' )+ " comments</span></p>"+
                                "<ul class='comments-wrap' data-kids='"+story.kids+"'></ul>"+
                              "</li>";
                  $("#news").append(item);
                  $("time").timeago();
              }
            })
        });
        //news loading done
        $("#loading").removeClass('loading');
      });
    }
  //init the app
  getHackerNews();

});
