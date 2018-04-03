/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() 
	{
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		$(function()
		{
			/************************ FORMULAIRE CONNEXION INSCRIPTION ***************************/
			$('.form').find('input, textarea').on('keyup blur focus', function (e) 
			{
					  
				var $this = $(this),
				label = $this.prev('label');

				if (e.type === 'keyup') 
				{
					if ($this.val() === '') 
					{
						label.removeClass('active highlight');
					} 
					else 
					{
						label.addClass('active highlight');
					}
				} 
				else if (e.type === 'blur') 
				{
					if( $this.val() === '' ) 
					{
						label.removeClass('active highlight'); 
					} 
					else 
					{
						label.removeClass('highlight');   
					}   
				} 
				else if (e.type === 'focus') 
				{
					if( $this.val() === '' ) 
					{
						label.removeClass('highlight'); 
					} 
					else if( $this.val() !== '' ) 
					{
						label.addClass('highlight');
					}
				}
			});

			$('.tab a').on('click', function (e) 
			{
				e.preventDefault();

				$(this).parent().addClass('active');
				$(this).parent().siblings().removeClass('active');

				target = $(this).attr('href');

				$('.tab-content > div').not(target).hide();

				$(target).fadeIn(600);

			});
		});
		/********************************************************************/
		/************************ JQUERY AVATAR ***************************/
		(function ($) 
		{
			$.extend(
			{
				uploadPreview : function (options) 
				{
					// Options + Defaults
					var settings = $.extend(
					{
						input_field: "#image-input",
						preview_box: "#image-preview",
						label_field: "#image-label",
						label_default: "Télécharger",
						label_selected: "Modifier",
						no_label: false,
						success_callback : null,
					}, options);

					// Check if FileReader is available
					if (window.File && window.FileList && window.FileReader) 
					{
						if (typeof($(settings.input_field)) !== 'undefined' && $(settings.input_field) !== null) 
						{
							$(settings.input_field).change(function() 
							{
								var files = this.files;

								if (files.length > 0) 
								{
									var file = files[0];
									var reader = new FileReader();

									// Load file
									reader.addEventListener("load",function(event) 
									{
										var loadedFile = event.target;

										// Check format
										if (file.type.match('image')) 
										{
										  // Image
										  $(settings.preview_box).css("background-image", "url("+loadedFile.result+")");
										  $(settings.preview_box).css("background-size", "cover");
										  $(settings.preview_box).css("background-position", "center center");
										} 
										else if (file.type.match('audio')) 
										{
											// Audio
											$(settings.preview_box).html("<audio controls><source src='" + loadedFile.result + "' type='" + file.type + "' />Your browser does not support the audio element.</audio>");
										} 
										else 
										{
											alert("This file type is not supported yet.");
										}
									});

									if (settings.no_label == false) 
									{
										// Change label
										$(settings.label_field).html(settings.label_selected);
									}

									// Read the file
									reader.readAsDataURL(file);

									// Success callback function call
									if(settings.success_callback)
									{
										settings.success_callback();
									}
								} 
								else 
								{
									if (settings.no_label == false) 
									{
										// Change label
										$(settings.label_field).html(settings.label_default);
									}
									
									// Clear background
									$(settings.preview_box).css("background-image", "none");

									// Remove Audio
									$(settings.preview_box + " audio").remove();
								}
							});
						}
					} 
					else 
					{
						alert("You need a browser with file reader support, to use this form properly.");
						return false;
					}
				}
			});
		})(jQuery);
		
		//on appelle la fonction
		$.uploadPreview({
			input_field: "#image-upload",
			preview_box: "#image-preview",
			label_field: "#image-label"
		});
		$.uploadPreview({
			input_field: "#casier-upload",
			preview_box: "#casier-preview",
			label_field: "#casier-label"
		});
		$.uploadPreview({
			input_field: "#permis-upload",
			preview_box: "#permis-preview",
			label_field: "#permis-label"
		});
		/********************************************************************/
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

