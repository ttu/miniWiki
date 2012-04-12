$(document).ready(function(){ 

	CheckLocalStoreValidity();

	// Minimize/Show clicked subfolder
	$('.subFolderTitle > .hideSubFolder').click(function(){ 
		var id = $(this).parent().attr('fId');

		var current = $('.subFolderEntries.fId_' + id);
		var key = 'fId_' + id;

		ChangeState(current, key);
	});

	// Minimize/Show all entries that belong to clicked subfolder
	$('.subFolderTitle > .minimizeEntries').click(function(){ 
		var id = $(this).parent().attr('fId');
		var idSting = '.fId_' + id;
		HandleUpDown($(this),$('.subFolderEntries.fId_' + id + ' > .entry > .entryText'), 'eId');
	}); 

	// Minimize/Show entry from title
	$('.entryTitle.hideEntry').click(function(){ 
		
		var id = $(this).parent().attr('eId');

		var current = $('.entryText.eId_' + id);
		var key = 'eId_' + id;

		ChangeState(current, key);
	}); 

	// Hide open entry from close button
	$('.closeEntry').click(function(){
		// TODO: Check correct from attributes
		$(this).parent().prev().click();
	}); 

	// Minimize/Show all subfolders
	$('#toggleSubFolders').click(function(){ 
		HandleUpDown($(this),$('.subFolderEntries'), 'fId');
	}); 

	// Minimize/Show all entries
	$('#toggleAllEntries').click(function(){ 
		HandleUpDown($(this),$('.entryText'), 'eId');
	}); 

	FormatTextAreas();
});

function ChangeState(current, localStorageKey)
{
	var value = current.css('display');

	if(value == 'block')
	{
		current.slideUp('normal'); 
		value = 'none';
	}
	else
	{
		current.slideDown('normal'); 
		value = 'block';
	}
	
	localStorage.setItem(localStorageKey, value);	
}

var useLocalStorage = true;

function CheckLocalStoreValidity()
{
	if (localStorage == null)
	{
		useLocalStorage = false;
		return;
	}
	
	var stored = localStorage.getItem('guid');
	var current = $('#guid').html();

	if (stored != current)
	{
		localStorage.clear();
		localStorage.setItem('guid', current);
	}
	
	// Go through all subfolders (maintitles)
	$('.subFolderTitle').each(function(){
		var id = $(this).attr('fId');

		if (id == null)
			return;
			
		var state = localStorage.getItem('fId_' + id);

		if (state != null)
			$('.subFolderEntries.fId_' + id).css('display', state);
	});

	// Go through all entries
	$('.entry').each(function(){
		var id = $(this).attr('eId');

		if (id == null)
			return;
			
		var state = localStorage.getItem('eId_' + id);

		if (state != null && state == 'block')
			$('.entryText.eId_' + id).removeClass('hidden');
	});
}

function FormatTextAreas()
{
	$('pre').each(function(){
		var text = $(this).text().replace(/\n\n/g, '<br/><br/>\n\n');
		var sections = text.trim().split( '\n' );
		var paddingPerChar = 20;
	   	var html = '';

		for( var index=0, padding=0; index < sections.length; index++ ) {
		    padding = ( sections[index].length - sections[index].trim().length ) *  paddingPerChar;
		    html += '<div style="padding-left:' + padding + 'px; margin-left:0px;">' + sections[index].trim() + '</div>';
		};

		$(this).html(html);
	});
}

function HandleUpDown(self, target, key){
	var action = self.attr('action');
	var display;

	if (action == 'up')
	{
		target.slideUp();
		action = 'down';
		display = 'none';
	}
	else
	{
		target.slideDown();
		action = 'up';
		display = 'block';
	}

	self.attr('action', action);

	target.each(function(){
		//TODO: Fix layout so don't need to find correct element to check key form
		var id;

		if (key == 'fId')
			id = $(this).prev().attr(key);
		else if (key == 'eId')
			id = $(this).parent().attr(key);
		else
			return;

		localStorage.setItem(key + '_' + id, display);
	});
}