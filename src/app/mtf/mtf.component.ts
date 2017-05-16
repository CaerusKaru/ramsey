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
  public svg;
  public mtfGraphs = [];
  public completeEdge;

  public G = {
    nodes: [],
    links: [],
    kInd: true
  };

  public kIndNum = 3;
  public nLinkNum = 5;

  constructor(
    private snackbar: MdSnackBar
  ) { }

  ngOnInit() {
    this.svg = d3.select(this.container.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
  }

  public changeGraph() {
    this.svg.selectAll('.node').remove();
    this.svg.selectAll('.link').remove();
    this.initGraph();
  }

  private MTF (G, k) {
    const snackbar = this.snackbar.open('Generating MTF graph');
    G = this.MTF_kInd(this.completeEdge, G, k);
    console.log(G);
    if (!G.kInd) {
      this.mtfGraphs.push(G);
      this.redrawGraph(G);
      this.Gen_MTF(G);
      snackbar.dismiss();
    }
  }

  private MTF_kInd (E, G, k) {
    // INVARIANT: G has no 3-clique
    for (let i = E.length - 1; i >= 0; i--) {
      const e = E[i];
      const e_mirror = {source: e.target, target: e.source};
      G.links.push(e);
      G.links.push(e_mirror);
      if (this.checkTriangle(G, e)) {
        G.links.splice(G.links.indexOf(e), 1);
        G.links.splice(G.links.indexOf(e_mirror), 1);
        E = E.filter(e_prime => {
          return !(e_prime.source === e_mirror.source && e_prime.target === e_mirror.target);
        });
      } else {
        let E_prime = [];
        Object.assign(E_prime, E);
        E_prime.splice(E_prime.indexOf(e), 1);
        E_prime = E_prime.filter(e_prime => {
          return !(e_prime.source === e_mirror.source && e_prime.target === e_mirror.target);
        });

        const H = this.MTF_kInd(E_prime, G, k);
        if (!H.kInd) {
          return H;
        } else {
          G.links.splice(G.links.indexOf(e), 1);
          G.links.splice(G.links.indexOf(e_mirror), 1);
          E = E.filter(e_prime => {
            return !(e_prime.source === e_mirror.source && e_prime.target === e_mirror.target);
          });
        }
      }
    }
    G.kInd = this.checkInd(G, k);
    return G;
  }

  private Gen_MTF (G) {
    console.log('gen mtf');
    for (let i = G.links.length - 1; i >= 0; i--) {
      const e = G.links[i];
      const G_prime = {
        nodes: [],
        links: []
      };
      Object.assign(G_prime, G);
      G_prime.links = G_prime.links.filter(e_prime => {
        return !((e.source === e_prime.source && e.target === e_prime.target) ||
        (e.target === e_prime.source && e.source === e_prime.target));
      });
      G.links = G.links.filter(e_prime => {
        return !(e_prime.target === e.source && e_prime.source === e.target);
      });
      if (!this.checkInd(G_prime, this.kIndNum)) {
        console.log('adding mtf graph');
        console.log(G_prime);
        this.mtfGraphs.push(G_prime);
        this.Gen_MTF(G_prime);
      }
    }
  }

  /*
      returns true if 3-clique found with source and target from e
   */
  private checkTriangle (G, e) {
    for (const v of G.nodes) {
      const legOne = G.links.reduce((a, v_prime) => {
        return a ? a : e.source === v_prime.source && v === v_prime.target;
      }, false);
      const legTwo = G.links.reduce((a, v_prime) => {
        return a ? a : v === v_prime.source && e.target === v_prime.target;
      }, false);
      if (legOne && legTwo) {
        return true;
      }
    }

    return false;
  }

  /*
      returns true if G is k-independent
   */
  private checkInd (G, k) {
    if (k === 0) {
      return true;
    }
    for (const v of G.nodes) {
      const H = {
        nodes: [],
        links: []
      };
      Object.assign(H, G);
      // remove v and its neighbors and all of their edges
      const removeNodes = [v];
      H.links.forEach(e => {
        if (e.target === v && removeNodes.indexOf(e.source) < 0) {
          removeNodes.push(e.source);
        } else if (e.source === v && removeNodes.indexOf(e.target) < 0) {
          removeNodes.push(e.target);
        }
      });
      H.links = H.links.filter(e => {
        return !(removeNodes.indexOf(e.target) > -1 || removeNodes.indexOf(e.source) > -1);
      });
      H.nodes = H.nodes.filter(v_prime => {
        return !(removeNodes.indexOf(v_prime) > -1);
      });
      if (this.checkInd(H, k - 1)) {
        return true;
      }
    }
    return false;
  }

  private initGraph () {
    const nodesArray = [];
    this.mtfGraphs = [];

    for (let count = 1; count <= this.nLinkNum; count++) {
      nodesArray.push({
        x: ((this.width - 15) / 2) * Math.cos(2 * Math.PI * count / this.nLinkNum + 350 / this.nLinkNum) + (this.width / 2),
        y: ((this.width - 15) / 2) * Math.sin(2 * Math.PI * count / this.nLinkNum + 350 / this.nLinkNum) + (this.width / 2)
      });
    }

    const nodes = nodesArray;
    const links = [];
    this.completeEdge = nodesArray.reduce((a, v1) => {
      return a.concat(...nodesArray.reduce((b, v2) => {
        if (v1.x === v2.x && v1.y === v2.y) {
          return b;
        }
        return b.concat({source: v1, target: v2});
      }, []));
    }, []);

    this.link = this.svg.selectAll('.link')
      .data(links)
      .enter().append('line')
      .attr('class', 'link');

    this.node = this.svg.selectAll('.node')
      .data(nodes)
      .enter().append('circle')
      .attr('class', 'node');

    // this.drawGraph(nodes, links);
    this.G = {
      nodes: nodes,
      links: links,
      kInd: true
    };
    this.MTF(this.G, this.kIndNum);
  }

  private drawGraph (nodes, links) {
    const snackbar = this.snackbar.open('Drawing graph');
    const self = this;
    this.simulation = d3.forceSimulation()
      .nodes(nodes)
      .on('end', function () {
        self.node.attr('r', self.width / 100)
          .attr('cx', function(d) { return d['x']; })
          .attr('cy', function(d) { return d['y']; });

        self.link.attr('x1', function(d) { return d['source'].x; })
          .attr('y1', function(d) { return d['source'].y; })
          .attr('x2', function(d) { return d['target'].x; })
          .attr('y2', function(d) { return d['target'].y; });
        snackbar.dismiss();
      });
  }

  private redrawGraph (G) {

    this.link = this.svg.selectAll('.link')
      .data(G.links)
      .enter().append('line')
      .attr('class', 'link');

    this.drawGraph(G.nodes, G.links);
  }
}
