import {Component, OnInit, ViewChild} from "@angular/core";
import {TimetableComponent} from "./components/timetable/timetable.component";
import {parseCourse, UofT} from "./models/course";
import {CourseService} from "./services/course.service";
import {PreferenceService} from "./services/preference.service";
import {AlertService} from "./services/alert.service";
import {Constraint, CourseSolution, ExhaustiveSolver, StepHeuristicSolver} from "./course-arrange";
import log = require("loglevel");
import {Term} from "./models/term";
import {environment} from "../environments/environment";
import {LogLevelDesc} from "loglevel";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    /**
     * A set of selected courses string in course bar
     * @type {string[]}
     */
    selectedCourses = ['CSC108', 'CSC165', 'MAT137', 'PSY100', 'ECO100'];

    /**
     * Controlling term panel
     */
    terms: Term[];
    activeTerm: Term;

    /**
     * Search-bar loading spin
     * @type {boolean}
     */
    loading: boolean = false;
    @ViewChild(TimetableComponent) timetable: TimetableComponent;

    /**
     * Current constraint list
     * Used by constraint.component
     */
    constraints: Constraint[];

    /**
     * Current solution displaying on the right part of main screen
     * Consumed by timetable.component
     */
    currentSolution: CourseSolution;
    /**
     * Currently displayed solution list on the scroll bar
     */
    solutions: CourseSolution[];


    constructor(private courseService: CourseService,
                private preferenceService: PreferenceService,
                private alertService: AlertService) {
        this.terms = Term.getTerms();
        this.activeTerm = this.terms[0];
        // this.courses = this.courseService.loadCourseData(this.activeTerm);
        // this.selectedCourses = this.courseService.loadCourseList();
        // this.alertService.success("hello world");
    }


    ngOnInit(): void {
        log.setLevel(<LogLevelDesc>environment.logLevel);
    }

    /**
     * Evaluate solution with given course list
     */
    eval(courses: UofT.Course[]) {
        const parsedCourses = courses.map(parseCourse);
        // Try Exhaustive Solver first
        const exSolver = new ExhaustiveSolver(parsedCourses);
        try {
            this.solutions = exSolver.solve(this.constraints);
        } catch (e) {
            log.info("ExhaustiveSolver failed");
            log.info(e);
            log.info("try heuristic solver");
            // If input too large, then use heuristic solver
            const heSolver = new StepHeuristicSolver(parsedCourses);
            this.solutions = heSolver.solve(this.constraints);
        }
    }

    selectTerm(term: Term) {
        this.activeTerm = term;
        // this.timetable.renderSolution(0, this.activeTerm);
    }

    // determineTerm(code) {
    //     if (code.indexOf("H1F") > -1) return ["2017 Fall"];
    //     if (code.indexOf("H1S") > -1) return ["2018 Winter"];
    //     if (code.indexOf("Y1Y") > -1) return ["2017 Fall", "2018 Winter"];
    //     else return [];
    // }

    deleteCourse(course: string): void {
        this.selectedCourses.splice(this.selectedCourses.indexOf(course), 1);
        // if (this.selectedCourses["2017 Fall"].indexOf(course) > -1) this.selectedCourses["2017 Fall"].splice(this.selectedCourses["2017 Fall"].indexOf(course), 1);
        // if (this.selectedCourses["2018 Winter"].indexOf(course) > -1) this.selectedCourses["2018 Winter"].splice(this.selectedCourses["2018 Winter"].indexOf(course), 1);
        // this.courseService.storeCourseList(this.selectedCourses);
        // this.determineTerm(course).forEach(activeTerm => this.dirty[activeTerm] = true);
    }

    addCourse(course: UofT.Course): void {
        this.selectedCourses.push(course.code);
        // if (course.code.indexOf("H1F") >= 0) {
        //     if (this.selectedCourses["2017 Fall"].indexOf(course.code) == -1) {
        //         this.selectedCourses["2017 Fall"].push(course.code);
        //         this.courseService.storeCourseList(this.selectedCourses);
        //     }
        // } else if (course.code.indexOf("H1S") >= 0) {
        //     if (this.selectedCourses["2018 Winter"].indexOf(course.code) == -1) {
        //         this.selectedCourses["2018 Winter"].push(course.code);
        //         this.courseService.storeCourseList(this.selectedCourses);
        //     }
        // } else {
        //     if (this.selectedCourses["2017 Fall"].indexOf(course.code) == -1) {
        //         this.selectedCourses["2017 Fall"].push(course.code);
        //     }
        //     if (this.selectedCourses["2018 Winter"].indexOf(course.code) == -1) {
        //         this.selectedCourses["2018 Winter"].push(course.code);
        //     }
        //     this.courseService.storeCourseList(this.selectedCourses);
        // }
        // this.determineTerm(course.code).forEach(activeTerm => this.dirty[activeTerm] = true);
    }

}
