//http://stackoverflow.com/a/9102270/1259747
function get_yt_video_id(url){

	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
	var match = url.match(regExp);

	if(match&&match[2].length==11){
	   	return match[2];
	}else{
		return false;
	}
}

function get_yt_video_content(id){
	// use proxy because IE8 cannot handle this request
	var url = 'https://gdata.youtube.com/feeds/api/videos/'+id;

	$("#media_list").prepend('<div class="new_load">Loading...</div>');

	$.getJSON(url,{'v': '2', 'alt':'json'}, function(yt){

		var entry = yt.entry;
		var title = entry.title.$t;
		var v_url = entry.content.src;
		var media = entry.media$group;
		var thumbnail = media.media$thumbnail[0].url;
		var description = media.media$description.$t;
		
		//(title.length > 70)? title = title.substr(0,70)+'[..]': title;
		(description.length > 120)? description = description.substr(0,120)+'[..]': description;

		r = '<div class="video_container" >';
		r += '<span class="btn_remove"><div class="btn_close"></div></span>';
		r += '<img class="movie-thumb" src="'+thumbnail+'" /> ';
		r += '<input type="hidden" value='+v_url+'"/>';
		r += '<a class="entry-title" href="'+v_url+'" >'+title+'</a><br/>';
			
		r += '<span class="entry-description">'+description+'</span>';
		r += '<div style="clear:both"></div></div>';
		
		$("#media_list .new_load").html(r).removeClass('new_load');
	});
}


$(document).ready(function(){
	
	$("#media_list").delegate('.video_container','mouseover mouseout',function(e){
		if(e.type == 'mouseover'){
			$(this).children('.btn_remove').css('visibility','visible');
		}

		if(e.type == 'mouseout'){
			$(this).children('.btn_remove').css('visibility','hidden');
		}
	});
	$("#btn_check").click(function(){
		
		var id = get_yt_video_id($("#video_url").val());
		get_yt_video_content(id);
		
	});

	$("#media_list").delegate('.btn_remove','click',function(){
		$(this).parent().fadeOut('fast',function(){
			$(this).parent().remove(); //usuwa jeszcze wrappera z new load
		});
	});
})