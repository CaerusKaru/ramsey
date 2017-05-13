import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {MdSnackBar} from '@angular/material';

@Component({
  selector: 'app-mtf',
  templateUrl: './mtf.component.html',
  styleUrls: ['./mtf.component.scss']
})
export class MTFComponent implements OnInit {

  @ViewChild('container') container: ElementRef;

  public width = 750;
  public height = 750;

  public simulation;
  public node;
  public color;
  public link;
  public links;
  public nodes;
  public svg;

  public adjust = 3;

  constructor(
    private snackbar: MdSnackBar
  ) { }

  ngOnInit() {
    this.svg = d3.select(this.container.nativeElement).append('svg').attr('width', this.width).attr('height', this.height);
    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    this.initGraph();
  }

  public changeGraph() {
    this.svg.selectAll('.node').remove();
    this.svg.selectAll('.link').remove();
    this.initGraph();
  }

  private initGraph () {
    const snackbar = this.snackbar.open('Loading graph...');
    const nodesArray = [];

    for (let count = 1; count <= this.adjust; count++) {
      nodesArray.push({
        x: ((this.width - 15) / 2) * Math.cos(2 * Math.PI * count / this.adjust + 350 / this.adjust) + (this.width / 2),
        y: ((this.width - 15) / 2) * Math.sin(2 * Math.PI * count / this.adjust + 350 / this.adjust) + (this.width / 2)
      });
    }

    this.nodes = nodesArray;
    this.links = nodesArray.reduce((a, v1) => {
      return a.concat(...nodesArray.reduce((b, v2) => {
        if (v1.x === v2.x && v1.y === v2.y) {
          return b;
        }
        return b.concat({source: v1, target: v2});
      }, []));
      // return a;
    }, []);

    const link = this.svg.selectAll('.link')
      .data(this.links)
      .enter().append('line')
      .attr('class', 'link');


    const node = this.svg.selectAll('.node')
      .data(this.nodes)
      .enter().append('circle')
      .attr('class', 'node');

    const self = this;
    this.simulation = d3.forceSimulation()
      .nodes(this.nodes)
      .on('end', function () {
        node.attr('r', self.width / 100)
          .attr('cx', function(d) { return d['x']; })
          .attr('cy', function(d) { return d['y']; });

        link.attr('x1', function(d) { return d['source'].x; })
          .attr('y1', function(d) { return d['source'].y; })
          .attr('x2', function(d) { return d['target'].x; })
          .attr('y2', function(d) { return d['target'].y; });

        snackbar.dismiss();
      });
  }
}
