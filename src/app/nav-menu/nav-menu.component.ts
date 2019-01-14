import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, Injectable, Input } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { Router } from '@angular/router';

/**
 * File node data with nested structure.
 * Each node has a filename, and a type or a list of children.
 */
export class FileNode {
  children: FileNode[];
  name: string;
  route: any;
}

/** Flat node with expandable and level information */
export class FileFlatNode {
  constructor(
    public expandable: boolean, public name: string, public level: number, public route: any) {}
}

/**
 * The file structure tree data in string. The data could be parsed into a Json object
 */
const TREE_DATA = JSON.stringify({
  Planets: {
    Add: 'planets/:id',
    List: 'planets'
  },
  Vehicles: 'vehicles',
  People: 'people'
});

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA);

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.name = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.route = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  providers: [FileDatabase]
})
export class NavMenuComponent implements OnInit {
  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
  // @Input('matTreeNodePaddingIndent') indent: number;

  constructor(database: FileDatabase, private router: Router) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => 
      {
        this.dataSource.data = data;
      });
  }

  ngOnInit() {
    
  }

  onSelect(node : FileFlatNode) {
    let idIndex = node.route.indexOf(':id');
    if (idIndex == -1) {
      this.router.navigate([node.route]);
    } else {
      let route = node.route.substring(0, idIndex - 1) + '/0';
      console.log(route);
      this.router.navigate([route]);
    }
  }

  transformer = (node: FileNode, level: number) => {
    return new FileFlatNode(!!node.children, node.name, level, node.route);
  }

  private _getLevel = (node: FileFlatNode) => node.level;

  private _isExpandable = (node: FileFlatNode) => node.expandable;

  private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);

  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;
}
