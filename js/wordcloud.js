function drawWC() {
  function print(text) {
    console.log(text);
  }
  d3.text("data/WordCloud.txt", function(data) {
    data = data.replace(/[\n]+/g, " ");
    data = data.replace(/[!\.,:;\?\"]/g, "");
    data = data.replace(/[0-9]/g, '');
    data = data.replace(/[\[\](),']+/g, "");
    var allWords = data.split(" ");
    // print(allWords);
    var dic = {};
    var common = ["a","an","the","and","but","if","or","as","he","him","she","it","they","we","you","i","am","er","re","en","fe","lu"];
    allWords.forEach(function(w) {
      uwu = w.toLowerCase();
      if (uwu.length > 1 && !stop_words.includes(uwu) && !common.includes(uwu)) {
        if (uwu in dic) {
          dic[uwu] += 1;
        } else {
          dic[uwu] = 1;
        }
      }
    });
    // normalize
    var min = 0;
    var max = 0;
    for (var key in dic) {
      if (dic[key] > max) {
        max = dic[key];
      }
    }
    var words = [];
    var newMin = 15;
    var newMax = 80;
    for (var key in dic) {
      words.push([key, (dic[key] / max - min) * (newMax - newMin) + newMin]);
    }
    print(words);
    cloud(words);
  });
  var fill = d3.scaleOrdinal(d3.schemeCategory20);
  function cloud(words) {
    d3.layout
      .cloud()
      // .size([1400, 600])
      .size([500, 500])
      .words(
        words.map(function(d) {
          // return {text: d[0], size: 90 + Math.random() * 50};}))
          // console.log(d);
          return { text: d[0], size: d[1] };
        })
      )
      .padding(3)
      .rotate(function(d) {
        return ~~(Math.random() * 0) * 90;
      })
      // .font("Impact")
      .font("Arial")
      .fontSize(function(d) {
        return d.size;
      })
      .on("end", draw)
      .start();
  }

  function draw(words) {
    d3.select("#wordcloud")
      .append("svg")
      .attr("width", 1000)
      .attr("height", 1000)
      .append("g")
      .attr("transform", "translate(300,300)")
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", function(d) {
        return d.size + "px";
      })
      .style("font-family", "impact")
      .style("fill", function(d, i) {
        return fill(i);
      })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) {
        return d.text;
      });
  }
}
drawWC();
