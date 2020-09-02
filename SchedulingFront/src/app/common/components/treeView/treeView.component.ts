import { Component, OnInit, Input } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';
import { of } from 'rxjs';
import { ITreeViewBase, TreeViewConfig } from './ITreeViewBase';

@Component({
  selector: 'tree-view',
  templateUrl: './treeView.component.html',
  styleUrls: ['./treeView.component.css']
})
export class TreeViewComponent implements OnInit {
  canAdd = true;
  expanded = false;
  constructor() { }
  treeControl = new NestedTreeControl((node: ITreeViewBase<any>) => this.GetChildren(node));
  datasource = new MatTreeNestedDataSource<ITreeViewBase<any>>();
  @Input() config = new TreeViewConfig();
  @Input() activeCheckbox = false;
  hasChild = (_: number, node: ITreeViewBase<any>) => this.expendable(node);
  private expendable(node: ITreeViewBase<any>) {
    if (!this.config || !this.config.childrenPropName) {
      return false;
    }
    return node[this.config.childrenPropName] && node[this.config.childrenPropName].length > 0;
  }
  GetChildren = (node: ITreeViewBase<any>) => !this.config || !this.config.childrenPropName ? [] : of(node[this.config.childrenPropName]);

  ngOnInit() {
  }

  setDatasource = (data) => this.datasource.data = data;

  unKnotTree(onlyDirty = false, fullArray: Array<ITreeViewBase<any>> = this.datasource.data) {
    fullArray.forEach(e => {
      if (e[this.config.childrenPropName]) {
        e[this.config.childrenPropName].forEach(c => {
          if (!onlyDirty || (onlyDirty && c.dirty)) {
            fullArray.push(c);
            this.unKnotTree(onlyDirty, [c]);
          }
        });
      }
    });
    return fullArray;
  }

  onCheckboxChange(node: ITreeViewBase<any>) {
    if (node[this.config.childrenPropName] && node[this.config.childrenPropName].length > 0) {
      node[this.config.childrenPropName].forEach(c => c.active = !node.active);
    }
    node.active = !node.active;
    if (!node[this.config.parentPropName] || node[this.config.parentPropName] <= 0) {
      return;
    }
    const siblings = this.findSiblings(this.datasource.data, node[this.config.parentPropName]);
    if (!siblings || siblings.length <= 0) {
      return;
    }
    const parent = this.findParent(this.datasource.data, node[this.config.parentPropName]);
    if (!siblings.find(s => s.active)) {
      parent.active = false;
    } else if (siblings.find(s => s.active)) {
      parent.active = true;
    }
  }

  findSiblings(data: Array<ITreeViewBase<any>>, matchId: number) {
    let siblings = [];
    data.forEach(d => {
      if (d[this.config.idPropName] === matchId) {
        siblings = d[this.config.childrenPropName];
      }
      if (d[this.config.childrenPropName] && d[this.config.childrenPropName].length > 0) {
        this.findSiblings(d[this.config.childrenPropName], matchId);
      }
    });
    return siblings;
  }

  findParent(data: Array<ITreeViewBase<any>>, matchId: number) {
    let parent = null;
    data.forEach(d => {
      if (d[this.config.idPropName] === matchId) {
        parent = d;
      }
      if (d[this.config.childrenPropName] && d[this.config.childrenPropName].length > 0) {
        this.findParent(d[this.config.childrenPropName], matchId);
      }
    });
    return parent;
  }

  nodeInputChange(node: ITreeViewBase<any>) {
    node.dirty = true;
  }
  onSlide(node: ITreeViewBase<any>, valueProp: string) {
    if (!node.allowSave) {
      return;
    }
    node.dirty = true;
    const value = node[valueProp].toString().toLowerCase();
    node[valueProp] = value === 'true' ? false : true;
  }
}
