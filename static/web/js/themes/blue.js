/**
 * blue theme for Highcharts JS
 * @author 郑斌
 */
Highcharts.theme = {
		colors: ["#015198","#ff6501","#009a3e","#fedd02","#019be1","#99cc33","#f1076a","#99cc33","#663433","#d1261e","#7042a4",'#4572A7', '#AA4643', '#89A54E', '#80699B'],
		chart: {
			backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
				stops: [
					[0, 'rgb(157,220,237)'],
					[1, 'rgb(80,141,196)']
				]
			},
			borderWidth: 1,
			borderColor: '#1c609d',
			borderRadius: 5,
			plotBackgroundColor: null,
			plotShadow: false,
			plotBorderWidth: 0
		},
		title: {
			style: {
				color: '#FFF',
				font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
			}
		},
		subtitle: {
			style: {
				color: '#DDD',
				font: '12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
			}
		},
		xAxis: {
			gridLineWidth: 0,
			lineWidth: 2,
			lineColor: '#014a59',
			tickColor: '#014a59',
			labels: {
				style: {
					color: '#FFFFFF',
					fontWeight: 'bold'
				}
			},
			title: {
				style: {
					color: '#FFFFFF',
					font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
				}
			}
		},
		yAxis: {
			alternateGridColor: null,
			minorTickInterval: null,
			gridLineWidth: 2,
			gridLineColor: 'rgba(255, 255, 255, .5)',
			lineWidth: 0,
			tickWidth: 0,
			labels: {
				style: {
					color: '#FFFFFF',
					fontWeight: 'bold'
				}
			},
			title: {
				style: {
					color: '#FFFFFF',
					font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
				}
			}
		},
		legend: {
			borderColor: '#1c609d',
			itemStyle: {
				color: '#4F59B0'
			},
			itemHoverStyle: {
				color: '#333'
			},
			itemHiddenStyle: {
				color: '#CCC'
			}
		},
		labels: {
			style: {
				color: '#CCC'
			}
		},
		plotOptions: {
			line: {
				dataLabels: {
					color: '#4F59B0'
				},
				marker: {
					lineColor: '#4F59B0'
				}
			},
			spline: {
				marker: {
					lineColor: '#333'
				}
			},
			scatter: {
				marker: {
					lineColor: '#333'
				}
			},
			candlestick: {
				lineColor: 'white'
			}
		},

		toolbar: {
			itemStyle: {
				color: '#CCC'
			}
		},

		navigation: {
			buttonOptions: {
				backgroundColor: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [
						[0.4, '#edf0f5'],
						[0.6, '#edf0f5']
					]
				},
				borderColor: '#edf0f5',
				symbolStroke: '#45686c',
				hoverSymbolStroke: '#45686c'
			}
		},

		exporting: {
			buttons: {
				exportButton: {
					symbolFill: '#bdd0d7'
				},
				printButton: {
					symbolFill: '#bdd0d7'
				}
			}
		},

		// scroll charts
		rangeSelector: {
			buttonTheme: {
				fill: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [
						[0.4, '#888'],
						[0.6, '#555']
					]
				},
				stroke: '#000000',
				style: {
					color: '#CCC',
					fontWeight: 'bold'
				},
				states: {
					hover: {
						fill: {
							linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
							stops: [
								[0.4, '#BBB'],
								[0.6, '#888']
							]
						},
						stroke: '#000000',
						style: {
							color: 'white'
						}
					},
					select: {
						fill: {
							linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
							stops: [
								[0.1, '#000'],
								[0.3, '#333']
							]
						},
						stroke: '#000000',
						style: {
							color: 'yellow'
						}
					}
				}
			},
			inputStyle: {
				backgroundColor: '#333',
				color: 'silver'
			},
			labelStyle: {
				color: 'silver'
			}
		},

		navigator: {
			handles: {
				backgroundColor: '#666',
				borderColor: '#AAA'
			},
			outlineColor: '#CCC',
			maskFill: 'rgba(16, 16, 16, 0.5)',
			series: {
				color: '#7798BF',
				lineColor: '#A6C7ED'
			}
		},

		scrollbar: {
			barBackgroundColor: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [
						[0.4, '#888'],
						[0.6, '#555']
					]
				},
			barBorderColor: '#CCC',
			buttonArrowColor: '#CCC',
			buttonBackgroundColor: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [
						[0.4, '#888'],
						[0.6, '#555']
					]
				},
			buttonBorderColor: '#CCC',
			rifleColor: '#FFF',
			trackBackgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
					[0, '#000'],
					[1, '#333']
				]
			},
			trackBorderColor: '#666'
		},

		// special colors for some of the demo examples
		legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
		legendBackgroundColorSolid: 'rgb(70, 70, 70)',
		dataLabelsColor: '#444',
		textColor: '#E0E0E0',
		maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
